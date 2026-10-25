<?php
// SPDX-License-Identifier: MIT
// Run inside a disposable WordPress installation: wp eval-file tests/wordpress-integration.php.
use ConsultEvo\Portfolio\Plugin;

function cpf_assert( bool $condition, string $message ): void { if ( ! $condition ) { throw new RuntimeException( $message ); } }
$admin = get_user_by( 'login', 'portfolio-admin' );
cpf_assert( (bool) $admin, 'Disposable test administrator is missing.' );
wp_set_current_user( $admin->ID );
$data = json_decode( file_get_contents( dirname( __DIR__ ) . '/examples/portfolio.json' ), true, 64, JSON_THROW_ON_ERROR );
$data['projects'][0]['evidence'][0]['src'] = ltrim( wp_make_link_relative( plugins_url( 'portfolio-case-studies/sample-media/workflow.svg' ) ), '/' );
cpf_assert( Plugin::import_portfolio( $data ) === 3, 'Should import three drafts.' );
cpf_assert( count( Plugin::collection()['projects'] ) === 0, 'Imported drafts must not be public.' );
cpf_assert( Plugin::import_portfolio( $data ) === 0, 'Repeated import must not duplicate projects.' );
$posts = get_posts( [ 'post_type' => Plugin::TYPE, 'post_status' => 'draft', 'numberposts' => -1, 'orderby' => 'ID', 'order' => 'ASC' ] );
cpf_assert( count( $posts ) === 3, 'Draft count differs.' );
$public = $posts[0]->ID; $private = $posts[1]->ID; $password = $posts[2]->ID;
wp_update_post( [ 'ID' => $public, 'post_status' => 'publish' ] );
wp_update_post( [ 'ID' => $private, 'post_status' => 'private', 'post_title' => 'DO-NOT-PUBLISH-PRIVATE' ] );
wp_update_post( [ 'ID' => $password, 'post_status' => 'publish', 'post_password' => 'disposable-test-only', 'post_title' => 'DO-NOT-PUBLISH-PASSWORD' ] );
update_post_meta( $public, 'internal_secret', 'DO-NOT-PUBLISH-META' );
$projection = Plugin::collection();
cpf_assert( count( $projection['projects'] ) === 1, 'Projection must exclude private and password-protected projects.' );
Plugin::validate( $projection );
$json = wp_json_encode( $projection );
cpf_assert( ! str_contains( $json, 'DO-NOT-PUBLISH' ), 'Private fields leaked into public projection.' );
$_POST = []; $before = get_post_meta( $public, Plugin::META, true ); Plugin::save( $public );
cpf_assert( get_post_meta( $public, Plugin::META, true ) === $before, 'Missing nonce must not save.' );
$subscriber = wp_create_user( 'portfolio-subscriber', 'disposable-local-test-only', 'subscriber@example.invalid' );
wp_set_current_user( $subscriber );
try { Plugin::import_portfolio( $data ); throw new RuntimeException( 'Subscriber import was allowed.' ); } catch ( RuntimeException $error ) { cpf_assert( $error->getMessage() === 'Administrator permission is required.', 'Unexpected capability result.' ); }
$_POST = [ 'cportfolio_nonce' => wp_create_nonce( 'cportfolio_save_' . $public ), 'cpf' => [ 'status' => 'live' ] ]; Plugin::save( $public );
cpf_assert( get_post_meta( $public, Plugin::META, true ) === $before, 'Subscriber changed story data.' );
wp_set_current_user( $admin->ID );
$p = Plugin::project( $public ); $steps = [];
foreach ( [ 'source', 'process', 'storage', 'output' ] as $kind ) { $steps[ $kind ] = ''; foreach ( $p['architecture']['nodes'] as $node ) { if ( $node['kind'] === $kind ) { $steps[ $kind ] = $node['label']; break; } } }
$_POST = [ 'cportfolio_nonce' => wp_create_nonce( 'cportfolio_save_' . $public ), 'cpf' => [ 'client' => 'Public example', 'status' => 'completed', 'sections' => $p['sections'], 'implementations' => $p['implementations'], 'evidence' => $p['evidence'], 'results' => $p['results'], 'steps' => $steps ] ];
$_POST['cpf']['sections']['overview']['body'] = '<script>alert("x")</script>Safe public text';
Plugin::save( $public ); $saved = get_post_meta( $public, Plugin::META, true );
cpf_assert( $saved['status'] === 'completed', 'Authorised story save failed.' );
cpf_assert( ! str_contains( $saved['sections']['overview']['body'], '<script' ), 'Story HTML was not sanitized.' );
cpf_assert( $saved['architecture'] === $p['architecture'], 'Unedited imported architecture changed.' );
$_POST['cpf']['evidence'][0]['src'] = 'javascript:alert(1)'; Plugin::save( $public );
cpf_assert( get_post_meta( $public, Plugin::META, true ) === $saved, 'Unsafe evidence replaced the saved story.' );
$_POST = [];
$html = do_shortcode( '[portfolio]' );
cpf_assert( substr_count( $html, 'class="pf-card"' ) === 1, 'Gallery should contain only one public card.' );
cpf_assert( ! str_contains( $html, 'DO-NOT-PUBLISH' ), 'Gallery leaked private data.' );
$story = Plugin::render_project( Plugin::project( $public ) );
cpf_assert( str_contains( $story, 'What we built' ) && ! str_contains( $story, '<script' ), 'Case study failed rendering or escaping.' );
do_action( 'rest_api_init' ); wp_set_current_user( 0 );
$response = rest_do_request( new WP_REST_Request( 'GET', '/portfolio/v1/projects' ) );
cpf_assert( $response->get_status() === 200, 'Public read route failed.' );
cpf_assert( count( $response->get_data()['projects'] ) === 1, 'REST route did not enforce publication filtering.' );
foreach ( [ 'javascript:alert(1)', '../private', 'media/%252e%252e/file', '//host/file', 'https://user:password@example.invalid/a' ] as $src ) { cpf_assert( ! Plugin::safe_source( $src ), 'Unsafe source accepted.' ); }
wp_set_current_user( $admin->ID );
$before_terms = Plugin::project( $public );
$alternate = $data; $alternate['projects'] = [ $data['projects'][0] ];
$alternate['projects'][0]['id'] = 'another-project'; $alternate['projects'][0]['slug'] = 'another-project';
$changed_tech = [];
foreach ( $alternate['projects'][0]['technologies'] as &$term ) { $changed_tech[ $term['id'] ] = 'alternate-' . $term['id']; $term['id'] = $changed_tech[ $term['id'] ]; } unset( $term );
foreach ( $alternate['projects'][0]['implementations'] as &$implementation ) { $implementation['technologyIds'] = array_map( static fn( $id ) => $changed_tech[ $id ], $implementation['technologyIds'] ); } unset( $implementation );
cpf_assert( Plugin::import_portfolio( $alternate ) === 1, 'Same-label alternate-ID import failed.' );
cpf_assert( Plugin::project( $public ) === $before_terms, 'Import changed existing classification IDs or references.' );
Plugin::validate( Plugin::collection() );
$invalid = $data; $invalid['projects'][0]['sections']['overview']['evidenceIds'] = [ 'missing-evidence' ];
$count = wp_count_posts( Plugin::TYPE )->draft;
try { Plugin::import_portfolio( $invalid ); throw new RuntimeException( 'Invalid import was allowed.' ); } catch ( RuntimeException $error ) { cpf_assert( $error->getMessage() === 'Unknown evidence reference.', 'Unexpected invalid import result.' ); }
cpf_assert( wp_count_posts( Plugin::TYPE )->draft === $count, 'Invalid import wrote partial drafts.' );
$page = wp_insert_post( [ 'post_type' => 'page', 'post_status' => 'publish', 'post_title' => 'Work', 'post_name' => 'work', 'post_content' => '[portfolio]' ] );
file_put_contents( sys_get_temp_dir() . '/portfolio-wordpress-test.json', wp_json_encode( Plugin::collection() ) );
WP_CLI::success( 'WordPress integration passed: draft-only import, duplicate protection, capabilities, nonce, saved story, escaping, graph preservation, unsafe-input rejection, public gallery/REST filtering. WordPress ' . get_bloginfo( 'version' ) . ', PHP ' . PHP_VERSION . ', gallery page ' . $page );
