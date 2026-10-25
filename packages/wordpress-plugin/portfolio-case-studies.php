<?php
/**
 * Plugin Name: Portfolio Case Studies
 * Description: Publish project galleries and case studies with implementations, evidence, architecture, and outcomes.
 * Version: 0.2.0
 * Requires at least: 6.4
 * Requires PHP: 8.1
 * Author: ConsultEvo
 * Plugin URI: https://github.com/evrimaslan85/portfolio
 * Update URI: https://github.com/evrimaslan85/portfolio
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * Text Domain: portfolio-case-studies
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

namespace ConsultEvo\Portfolio;

if ( ! defined( 'ABSPATH' ) ) { exit; }

final class Plugin {
    public const VERSION = '0.2.0';
    public const TYPE = 'cportfolio_project';
    public const SYSTEM = 'cportfolio_system';
    public const TECH = 'cportfolio_tech';
    public const META = '_cportfolio_data';

    public static function boot(): void {
        add_action( 'init', [ self::class, 'register' ] );
        add_action( 'add_meta_boxes', [ self::class, 'boxes' ] );
        add_action( 'save_post_' . self::TYPE, [ self::class, 'save' ] );
        add_action( 'admin_enqueue_scripts', [ self::class, 'admin_assets' ] );
        add_action( 'wp_enqueue_scripts', [ self::class, 'assets' ] );
        add_action( 'admin_menu', [ self::class, 'menu' ] );
        add_action( 'admin_init', [ self::class, 'settings' ] );
        add_action( 'admin_notices', [ self::class, 'notices' ] );
        add_action( 'admin_post_cportfolio_create_page', [ self::class, 'create_page' ] );
        add_action( 'admin_post_cportfolio_samples', [ self::class, 'samples' ] );
        add_action( 'admin_post_cportfolio_import', [ self::class, 'import_action' ] );
        add_action( 'admin_post_cportfolio_export', [ self::class, 'export_action' ] );
        add_action( 'rest_api_init', [ self::class, 'routes' ] );
        add_filter( 'the_content', [ self::class, 'single_content' ], 20 );
        add_shortcode( 'portfolio', [ self::class, 'shortcode' ] );
    }

    public static function register(): void {
        register_post_type( self::TYPE, [
            'labels' => [ 'name' => __( 'Portfolio', 'portfolio-case-studies' ), 'singular_name' => __( 'Project', 'portfolio-case-studies' ), 'add_new_item' => __( 'Add Project', 'portfolio-case-studies' ), 'edit_item' => __( 'Edit Project', 'portfolio-case-studies' ) ],
            'public' => true, 'show_in_rest' => true, 'menu_icon' => 'dashicons-portfolio', 'has_archive' => false,
            'rewrite' => [ 'slug' => 'portfolio-project' ], 'supports' => [ 'title', 'excerpt', 'thumbnail', 'revisions' ],
            'taxonomies' => [ self::SYSTEM, self::TECH ], 'map_meta_cap' => true,
        ] );
        register_taxonomy( self::SYSTEM, self::TYPE, [ 'label' => __( 'Systems / Services', 'portfolio-case-studies' ), 'public' => false, 'show_ui' => true, 'show_in_rest' => true, 'hierarchical' => true ] );
        register_taxonomy( self::TECH, self::TYPE, [ 'label' => __( 'Technologies', 'portfolio-case-studies' ), 'public' => false, 'show_ui' => true, 'show_in_rest' => true, 'hierarchical' => false ] );
    }

    public static function activate(): void { self::register(); flush_rewrite_rules(); }
    public static function deactivate(): void { unregister_post_type( self::TYPE ); flush_rewrite_rules(); }

    private static function uuid( string $prefix = 'item' ): string { return $prefix . '-' . wp_generate_uuid4(); }
    private static function text( mixed $value ): string { return is_scalar( $value ) ? sanitize_textarea_field( (string) $value ) : ''; }
    private static function limited( mixed $value, int $max ): string { preg_match( '/^.{0,' . $max . '}/us', self::text( $value ), $match ); return $match[0] ?? ''; }
    private static function id( string $value, string $fallback = 'item' ): string { return preg_match( '/^[a-z][a-z0-9-]{0,79}$/D', $value ) ? $value : self::uuid( $fallback ); }
    private static function section( string $title ): array { return [ 'title' => $title, 'body' => '', 'evidenceIds' => [] ]; }
    public static function blank( int $post_id ): array {
        return [ 'id' => 'project-' . $post_id, 'slug' => 'project-' . $post_id, 'title' => 'Untitled project', 'summary' => 'Read the case study.', 'status' => 'prototype', 'featured' => false, 'systems' => [], 'technologies' => [], 'sections' => [ 'overview' => self::section( 'Overview' ), 'challenge' => self::section( 'The challenge' ), 'solution' => self::section( 'The solution' ), 'outcomes' => self::section( 'Results and impact' ) ], 'implementations' => [], 'architecture' => [ 'nodes' => [], 'edges' => [] ], 'results' => [], 'evidence' => [] ];
    }

    private static function classifications( int $post_id, string $taxonomy ): array {
        $terms = wp_get_object_terms( $post_id, $taxonomy ); if ( is_wp_error( $terms ) ) { return []; }
        return array_map( static function ( $term ) {
            $portable = get_term_meta( $term->term_id, '_cportfolio_id', true );
            return [ 'id' => $portable ?: 'term-' . $term->term_id, 'label' => self::limited( $term->name, 100 ) ];
        }, $terms );
    }

    public static function project( int $post_id ): array {
        $post = get_post( $post_id ); $data = get_post_meta( $post_id, self::META, true );
        if ( ! is_array( $data ) || ! isset( $data['sections'] ) ) { $data = self::blank( $post_id ); }
        $data['title'] = self::limited( $post->post_title, 140 ) ?: 'Untitled project';
        $data['summary'] = self::limited( $post->post_excerpt, 500 ) ?: 'Read the case study.';
        $slug = preg_replace( '/[^a-z0-9-]/', '-', strtolower( $post->post_name ) );
        $data['slug'] = preg_match( '/^[a-z]/', $slug ) && strlen( $slug ) <= 80 ? $slug : 'project-' . $post_id;
        $data['systems'] = self::classifications( $post_id, self::SYSTEM ); $data['technologies'] = self::classifications( $post_id, self::TECH );
        $tech_ids = array_column( $data['technologies'], 'id' );
        foreach ( $data['implementations'] as &$item ) { $item['technologyIds'] = array_values( array_intersect( $item['technologyIds'], $tech_ids ) ); } unset( $item );
        return $data;
    }

    public static function collection( int $page = 1, int $limit = 100 ): array {
        $settings = get_option( 'cportfolio_settings', [] );
        $query = self::published_query( $page, $limit );
        return [ 'schemaVersion' => '0.1.0', 'title' => self::limited( $settings['title'] ?? 'Our work', 140 ) ?: 'Our work', 'summary' => self::limited( $settings['summary'] ?? 'The projects, systems, and evidence behind the work.', 500 ) ?: 'Project stories.', 'locale' => str_replace( '_', '-', get_locale() ), 'projects' => array_map( static fn( $post ) => self::project( $post->ID ), $query->posts ) ];
    }

    private static function published_query( int $page, int $limit ): \WP_Query { return new \WP_Query( [ 'post_type' => self::TYPE, 'post_status' => 'publish', 'has_password' => false, 'posts_per_page' => min( 100, max( 1, $limit ) ), 'paged' => max( 1, $page ), 'orderby' => 'date ID', 'order' => 'DESC' ] ); }

    public static function boxes(): void { add_meta_box( 'cportfolio_story', __( 'Project story and evidence', 'portfolio-case-studies' ), [ self::class, 'editor' ], self::TYPE, 'normal', 'high' ); }
    private static function input( string $label, string $name, mixed $value, bool $area = false ): void {
        echo '<label class="cpf-field"><span>' . esc_html( $label ) . '</span>';
        if ( $area ) { echo '<textarea rows="4" name="' . esc_attr( $name ) . '">' . esc_textarea( self::text( $value ) ) . '</textarea>'; }
        else { echo '<input type="text" name="' . esc_attr( $name ) . '" value="' . esc_attr( self::text( $value ) ) . '">'; }
        echo '</label>';
    }
    public static function editor( $post ): void {
        $p = self::project( $post->ID ); wp_nonce_field( 'cportfolio_save_' . $post->ID, 'cportfolio_nonce' );
        echo '<p>Add the public story here. Use Excerpt for the short card summary and the Systems / Technologies panels for filters. Only published, non-password-protected projects appear in the public gallery.</p>';
        self::input( 'Public client label (optional)', 'cpf[client]', $p['client']['displayName'] ?? '' );
        echo '<label class="cpf-field"><span>Delivery status</span><select name="cpf[status]">';
        foreach ( [ 'prototype', 'live', 'completed', 'ongoing' ] as $status ) { echo '<option value="' . esc_attr( $status ) . '" ' . selected( $p['status'], $status, false ) . '>' . esc_html( ucfirst( $status ) ) . '</option>'; } echo '</select></label>';
        foreach ( $p['sections'] as $key => $section ) { echo '<h3>' . esc_html( ucfirst( $key ) ) . '</h3>'; self::input( 'Heading', 'cpf[sections][' . $key . '][title]', $section['title'] ); self::input( 'Story', 'cpf[sections][' . $key . '][body]', $section['body'], true ); }
        foreach ( [ 'implementations' => 'What we built', 'evidence' => 'Screenshots and evidence', 'results' => 'Outcomes' ] as $key => $heading ) {
            echo '<h3>' . esc_html( $heading ) . '</h3><div data-cpf-list="' . esc_attr( $key ) . '">';
            foreach ( $p[ $key ] as $index => $item ) { self::row( $key, (string) $index, $item ); }
            echo '</div><button type="button" class="button" data-cpf-add="' . esc_attr( $key ) . '">Add item</button><template data-cpf-template="' . esc_attr( $key ) . '">'; self::row( $key, '__INDEX__', [] ); echo '</template>';
        }
        echo '<details><summary><strong>Architecture (optional)</strong></summary><p>Describe an ordered sequence. Editing these steps replaces the imported graph. Unchanged steps preserve its original structure.</p>';
        foreach ( [ 'source', 'process', 'storage', 'output' ] as $kind ) { $label = ''; foreach ( $p['architecture']['nodes'] as $node ) { if ( $node['kind'] === $kind ) { $label = $node['label']; break; } } self::input( ucfirst( $kind ), 'cpf[steps][' . $kind . ']', $label ); } echo '</details>';
    }

    private static function row( string $key, string $index, array $item ): void {
        $base = 'cpf[' . $key . '][' . $index . ']';
        echo '<div class="cpf-row"><input type="hidden" name="' . esc_attr( $base . '[id]' ) . '" value="' . esc_attr( $item['id'] ?? '__ID__' ) . '">';
        if ( $key === 'implementations' ) { self::input( 'Title', $base . '[title]', $item['title'] ?? '' ); self::input( 'Short explanation', $base . '[summary]', $item['summary'] ?? '' ); self::input( 'Details', $base . '[details]', $item['details'] ?? '', true ); }
        if ( $key === 'evidence' ) {
            echo '<label class="cpf-field"><span>Type</span><select name="' . esc_attr( $base . '[type]' ) . '">'; foreach ( [ 'image', 'link', 'video' ] as $type ) { echo '<option ' . selected( $item['type'] ?? 'image', $type, false ) . '>' . esc_html( $type ) . '</option>'; } echo '</select></label>';
            self::input( 'Title', $base . '[title]', $item['title'] ?? '' );
            echo '<div class="cpf-media">'; self::input( 'Image or evidence URL (HTTPS or site-root-relative path)', $base . '[src]', $item['src'] ?? '' ); echo '<button type="button" class="button" data-cpf-media>Choose image</button></div>';
            self::input( 'Alternative text (images)', $base . '[alt]', $item['alt'] ?? '' ); self::input( 'Caption', $base . '[caption]', $item['caption'] ?? '' );
        }
        if ( $key === 'results' ) {
            self::input( 'Label', $base . '[label]', $item['label'] ?? '' ); self::input( 'Value or outcome', $base . '[value]', $item['value'] ?? '' ); self::input( 'Context / how the result was established', $base . '[context]', $item['context'] ?? '', true );
            echo '<label class="cpf-field"><span>Result basis</span><select name="' . esc_attr( $base . '[provenance]' ) . '">'; foreach ( [ 'reported', 'measured', 'illustrative' ] as $type ) { echo '<option ' . selected( $item['provenance'] ?? 'reported', $type, false ) . '>' . esc_html( $type ) . '</option>'; } echo '</select></label>';
        }
        echo '<button type="button" class="button-link-delete" data-cpf-remove>Remove item</button></div>';
    }

    private static function notice( string $text ): void { set_transient( 'cpf_notice_' . get_current_user_id(), $text, 60 ); }
    public static function notices(): void { $key = 'cpf_notice_' . get_current_user_id(); $text = get_transient( $key ); if ( $text ) { delete_transient( $key ); echo '<div class="notice notice-info is-dismissible"><p>' . esc_html( $text ) . '</p></div>'; } }

    public static function save( int $post_id ): void {
        if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) || ! current_user_can( 'edit_post', $post_id ) || ! isset( $_POST['cportfolio_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['cportfolio_nonce'] ) ), 'cportfolio_save_' . $post_id ) ) { return; }
        $raw = isset( $_POST['cpf'] ) && is_array( $_POST['cpf'] ) ? wp_unslash( $_POST['cpf'] ) : [];
        $p = self::project( $post_id ); $previous = $p; $p['status'] = self::text( $raw['status'] ?? 'prototype' );
        $client = self::text( $raw['client'] ?? '' ); unset( $p['client'] ); if ( $client !== '' ) { $p['client'] = [ 'displayName' => $client ]; }
        foreach ( $p['sections'] as $key => &$section ) { $section['title'] = self::text( $raw['sections'][ $key ]['title'] ?? $section['title'] ); $section['body'] = self::text( $raw['sections'][ $key ]['body'] ?? '' ); } unset( $section );
        foreach ( [ 'implementations', 'evidence', 'results' ] as $key ) {
            $p[ $key ] = [];
            foreach ( array_slice( is_array( $raw[ $key ] ?? null ) ? $raw[ $key ] : [], 0, 100 ) as $row ) {
                if ( ! is_array( $row ) ) { continue; } $id = self::id( self::text( $row['id'] ?? '' ) ); $old = []; foreach ( $previous[ $key ] as $existing ) { if ( $existing['id'] === $id ) { $old = $existing; break; } }
                if ( $key === 'implementations' ) { if ( ! trim( self::text( $row['title'] ?? '' ) ) ) { continue; } $p[ $key ][] = [ 'id' => $id, 'title' => self::text( $row['title'] ), 'summary' => self::text( $row['summary'] ?? '' ) ?: self::text( $row['title'] ), 'details' => self::text( $row['details'] ?? '' ), 'status' => $old['status'] ?? $p['status'], 'technologyIds' => $old['technologyIds'] ?? [], 'evidenceIds' => $old['evidenceIds'] ?? [] ]; }
                if ( $key === 'evidence' ) { $src = self::text( $row['src'] ?? '' ); if ( $src === '' ) { continue; } $p[ $key ][] = [ 'id' => $id, 'type' => self::text( $row['type'] ?? 'image' ), 'title' => self::text( $row['title'] ?? '' ) ?: 'Evidence', 'src' => $src, 'alt' => self::text( $row['alt'] ?? '' ), 'caption' => self::text( $row['caption'] ?? '' ) ]; }
                if ( $key === 'results' ) { if ( ! trim( self::text( $row['label'] ?? '' ) ) ) { continue; } $p[ $key ][] = [ 'id' => $id, 'label' => self::text( $row['label'] ), 'value' => self::text( $row['value'] ?? '' ), 'context' => self::text( $row['context'] ?? '' ), 'provenance' => self::text( $row['provenance'] ?? 'reported' ), 'evidenceIds' => $old['evidenceIds'] ?? [] ]; }
            }
        }
        $ids = array_column( $p['evidence'], 'id' ); foreach ( [ 'sections', 'implementations', 'results' ] as $key ) { foreach ( $p[ $key ] as &$item ) { $item['evidenceIds'] = array_values( array_intersect( $item['evidenceIds'], $ids ) ); } unset( $item ); }
        $old_steps = []; foreach ( [ 'source', 'process', 'storage', 'output' ] as $kind ) { $old_steps[ $kind ] = ''; foreach ( $previous['architecture']['nodes'] as $node ) { if ( $node['kind'] === $kind ) { $old_steps[ $kind ] = $node['label']; break; } } }
        $steps = []; foreach ( $old_steps as $kind => $unused ) { $steps[ $kind ] = self::text( $raw['steps'][ $kind ] ?? '' ); }
        if ( $old_steps !== $steps ) { $p['architecture'] = [ 'nodes' => [], 'edges' => [] ]; foreach ( $steps as $kind => $label ) { if ( $label === '' ) { continue; } $nodes = &$p['architecture']['nodes']; if ( $nodes ) { $p['architecture']['edges'][] = [ 'from' => end( $nodes )['id'], 'to' => 'step-' . $kind, 'label' => '' ]; } $nodes[] = [ 'id' => 'step-' . $kind, 'label' => $label, 'kind' => $kind ]; unset( $nodes ); } }
        try { self::validate( self::wrap( [ $p ] ) ); update_post_meta( $post_id, self::META, wp_slash( $p ) ); update_post_meta( $post_id, '_cportfolio_portable_id', $p['id'] ); }
        catch ( \Throwable $error ) { self::notice( 'Story fields were not saved: ' . $error->getMessage() . '. Your previous story is preserved; the title/excerpt may still have been saved by WordPress.' ); }
    }

    public static function admin_assets(): void {
        $screen = get_current_screen(); if ( ! $screen || $screen->post_type !== self::TYPE ) { return; }
        wp_enqueue_media(); wp_enqueue_script( 'cportfolio-admin', plugins_url( 'assets/admin.js', __FILE__ ), [], self::VERSION, true ); wp_enqueue_style( 'cportfolio-admin', plugins_url( 'assets/admin.css', __FILE__ ), [], self::VERSION );
    }
    public static function assets(): void {
        $post = get_post(); if ( is_singular( self::TYPE ) || ( $post && has_shortcode( $post->post_content, 'portfolio' ) ) ) { self::enqueue(); }
    }
    private static function enqueue(): void { wp_enqueue_style( 'cportfolio', plugins_url( 'assets/portfolio.css', __FILE__ ), [], self::VERSION ); wp_enqueue_script( 'cportfolio', plugins_url( 'assets/frontend.js', __FILE__ ), [], self::VERSION, true ); }

    private static function body( string $text ): string { return '<p>' . nl2br( esc_html( $text ) ) . '</p>'; }
    private static function evidence_url( string $src ): string { if ( str_starts_with( $src, 'https://' ) ) { return $src; } $url = wp_parse_url( home_url() ); return $url['scheme'] . '://' . $url['host'] . ( isset( $url['port'] ) ? ':' . $url['port'] : '' ) . '/' . ltrim( $src, '/' ); }
    private static function render_evidence( array $p, array $ids ): string {
        $html = ''; foreach ( $p['evidence'] as $item ) { if ( ! in_array( $item['id'], $ids, true ) ) { continue; } $url = self::evidence_url( $item['src'] ); $html .= '<figure class="pf-evidence">'; if ( $item['type'] === 'image' ) { $html .= '<img loading="lazy" src="' . esc_url( $url ) . '" alt="' . esc_attr( $item['alt'] ) . '">'; } $html .= '<figcaption><a href="' . esc_url( $url ) . '" target="_blank" rel="noopener noreferrer">' . esc_html( $item['title'] ) . ' ↗</a>' . self::body( $item['caption'] ) . '</figcaption></figure>'; } return $html;
    }
    public static function render_project( array $p ): string {
        $html = '<div class="portfolio-app pf-single"><header class="pf-heading"><p class="pf-eyebrow">' . esc_html( $p['status'] . ( isset( $p['client'] ) ? ' / ' . $p['client']['displayName'] : '' ) ) . '</p><h1>' . esc_html( $p['title'] ) . '</h1>' . self::body( $p['summary'] ) . '</header>';
        foreach ( [ 'overview', 'challenge', 'solution' ] as $key ) { $s = $p['sections'][ $key ]; if ( trim( $s['body'] ) !== '' ) { $html .= '<section class="pf-section"><h2>' . esc_html( $s['title'] ) . '</h2>' . self::body( $s['body'] ) . self::render_evidence( $p, $s['evidenceIds'] ) . '</section>'; } }
        if ( $p['architecture']['nodes'] ) { $html .= '<section class="pf-section"><h2>How the system works</h2><ol class="pf-nodes">'; $labels = []; foreach ( $p['architecture']['nodes'] as $node ) { $labels[ $node['id'] ] = $node['label']; $html .= '<li>' . esc_html( $node['label'] ) . '</li>'; } $html .= '</ol><ul>'; foreach ( $p['architecture']['edges'] as $edge ) { $html .= '<li>' . esc_html( ( $labels[ $edge['from'] ] ?? '' ) . ' → ' . ( $labels[ $edge['to'] ] ?? '' ) . ( $edge['label'] ? ': ' . $edge['label'] : '' ) ) . '</li>'; } $html .= '</ul></section>'; }
        if ( $p['implementations'] ) { $html .= '<section class="pf-section"><h2>What we built</h2>'; foreach ( $p['implementations'] as $item ) { $html .= '<details><summary>' . esc_html( $item['title'] ) . '</summary>' . self::body( $item['summary'] ) . self::body( $item['details'] ) . self::render_evidence( $p, $item['evidenceIds'] ) . '</details>'; } $html .= '</section>'; }
        $s = $p['sections']['outcomes']; if ( trim( $s['body'] ) !== '' ) { $html .= '<section class="pf-section"><h2>' . esc_html( $s['title'] ) . '</h2>' . self::body( $s['body'] ) . self::render_evidence( $p, $s['evidenceIds'] ) . '</section>'; }
        if ( $p['results'] ) { $html .= '<section class="pf-section"><h2>Outcomes, with context</h2><div class="pf-results">'; foreach ( $p['results'] as $r ) { $html .= '<article><p class="pf-eyebrow">' . esc_html( $r['provenance'] ) . '</p><strong>' . esc_html( $r['value'] ) . '</strong><h3>' . esc_html( $r['label'] ) . '</h3>' . self::body( $r['context'] ) . self::render_evidence( $p, $r['evidenceIds'] ) . '</article>'; } $html .= '</div></section>'; }
        if ( $p['evidence'] ) { $html .= '<section class="pf-section"><h2>Evidence</h2>' . self::render_evidence( $p, array_column( $p['evidence'], 'id' ) ) . '</section>'; }
        $settings = get_option( 'cportfolio_settings', [] ); if ( ! empty( $settings['cta_url'] ) && ! empty( $settings['cta_label'] ) ) { $html .= '<p><a href="' . esc_url( $settings['cta_url'] ) . '">' . esc_html( $settings['cta_label'] ) . '</a></p>'; }
        return $html . '</div>';
    }
    public static function single_content( string $content ): string { if ( ! is_admin() && is_singular( self::TYPE ) && in_the_loop() && is_main_query() ) { if ( post_password_required() ) { return get_the_password_form(); } return self::render_project( self::project( get_the_ID() ) ); } return $content; }

    public static function shortcode(): string {
        self::enqueue(); $page = isset( $_GET['portfolio_page'] ) && is_scalar( $_GET['portfolio_page'] ) ? max( 1, absint( $_GET['portfolio_page'] ) ) : 1;
        $data = self::collection( $page, 24 ); $query = self::published_query( $page, 24 ); $post_map = []; foreach ( $query->posts as $post ) { $post_map[ self::project( $post->ID )['id'] ] = $post; } $systems = []; $tech = []; foreach ( $data['projects'] as $p ) { foreach ( $p['systems'] as $t ) { $systems[ $t['id'] ] = $t['label']; } foreach ( $p['technologies'] as $t ) { $tech[ $t['id'] ] = $t['label']; } }
        $html = '<div class="portfolio-app" data-cpf-gallery><header class="pf-heading"><h1>' . esc_html( $data['title'] ) . '</h1>' . self::body( $data['summary'] ) . '</header><div class="pf-filters">';
        foreach ( [ 'system' => $systems, 'tech' => $tech ] as $key => $terms ) { $html .= '<label>' . ( $key === 'system' ? 'System' : 'Technology' ) . '<select data-cpf-filter="' . esc_attr( $key ) . '"><option value="">All</option>'; foreach ( $terms as $id => $label ) { $html .= '<option value="' . esc_attr( $id ) . '">' . esc_html( $label ) . '</option>'; } $html .= '</select></label>'; }
        $html .= '<p role="status" aria-live="polite" data-cpf-count>' . count( $data['projects'] ) . ' projects</p></div><div class="pf-grid">';
        foreach ( $data['projects'] as $p ) { $post = $post_map[ $p['id'] ] ?? null; if ( ! $post ) { continue; } $html .= '<article class="pf-card" data-cpf-system="' . esc_attr( implode( ' ', array_column( $p['systems'], 'id' ) ) ) . '" data-cpf-tech="' . esc_attr( implode( ' ', array_column( $p['technologies'], 'id' ) ) ) . '">'; $thumb = get_the_post_thumbnail( $post->ID, 'medium_large', [ 'class' => 'pf-cover' ] ); $html .= $thumb ?: '<div class="pf-card-mark" aria-hidden="true">' . esc_html( substr( $p['title'], 0, 1 ) ) . '</div>'; $html .= '<div class="pf-card-body"><p class="pf-eyebrow">' . esc_html( $p['status'] ) . '</p><h2><a href="' . esc_url( get_permalink( $post ) ) . '">' . esc_html( $p['title'] ) . '</a></h2>' . self::body( $p['summary'] ) . '<div class="pf-tags">'; foreach ( $p['technologies'] as $t ) { $html .= '<span>' . esc_html( $t['label'] ) . '</span>'; } $html .= '</div><a class="pf-project-link" href="' . esc_url( get_permalink( $post ) ) . '">Read case study ↗</a></div></article>'; }
        $html .= '</div><p class="pf-empty" data-cpf-empty ' . ( $data['projects'] ? 'hidden' : '' ) . '>No published projects match these filters.</p><nav class="pf-pagination" aria-label="Portfolio pages">';
        if ( $page > 1 ) { $html .= '<a href="' . esc_url( add_query_arg( 'portfolio_page', $page - 1 ) ) . '">Previous</a>'; } if ( $query->max_num_pages > $page ) { $html .= '<a href="' . esc_url( add_query_arg( 'portfolio_page', $page + 1 ) ) . '">Next</a>'; } return $html . '</nav></div>';
    }

    public static function menu(): void { add_submenu_page( 'edit.php?post_type=' . self::TYPE, 'Portfolio setup', 'Setup / Import / Export', 'manage_options', 'cportfolio-setup', [ self::class, 'setup' ] ); }
    public static function settings(): void { register_setting( 'cportfolio', 'cportfolio_settings', [ 'sanitize_callback' => static function ( $value ) { $value = is_array( $value ) ? $value : []; return [ 'title' => self::text( $value['title'] ?? '' ) ?: 'Our work', 'summary' => self::text( $value['summary'] ?? '' ) ?: 'The projects, systems, and evidence behind the work.', 'cta_label' => self::text( $value['cta_label'] ?? '' ), 'cta_url' => esc_url_raw( self::text( $value['cta_url'] ?? '' ), [ 'https', 'http' ] ) ]; } ] ); }
    private static function action_form( string $action, string $button ): void { echo '<form action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" method="post"><input type="hidden" name="action" value="' . esc_attr( $action ) . '">'; wp_nonce_field( $action ); submit_button( $button, 'secondary' ); echo '</form>'; }
    public static function setup(): void {
        if ( ! current_user_can( 'manage_options' ) ) { return; } $s = get_option( 'cportfolio_settings', [] );
        echo '<div class="wrap"><h1>Portfolio setup</h1><p>1. Create a Work page. 2. Add projects under Portfolio → Add Project. 3. Publish the projects you want visitors to see.</p><p>Alternatively, put <code>[portfolio]</code> in any page. The sample import creates drafts only. No account or external service is required.</p>';
        self::action_form( 'cportfolio_create_page', 'Create Work page' ); self::action_form( 'cportfolio_samples', 'Add fictional sample drafts' );
        echo '<h2>Gallery settings</h2><form method="post" action="options.php">'; settings_fields( 'cportfolio' ); self::input( 'Gallery heading', 'cportfolio_settings[title]', $s['title'] ?? 'Our work' ); self::input( 'Gallery introduction', 'cportfolio_settings[summary]', $s['summary'] ?? 'The projects, systems, and evidence behind the work.', true ); self::input( 'Optional contact button text', 'cportfolio_settings[cta_label]', $s['cta_label'] ?? '' ); self::input( 'Optional contact URL', 'cportfolio_settings[cta_url]', $s['cta_url'] ?? '' ); submit_button( 'Save settings' ); echo '</form><h2>Move your content</h2><p>Export published, non-password-protected projects as JSON. Imports always create drafts; existing matching portable IDs are skipped. Upload media separately and review evidence URLs before publication. Relative evidence paths resolve from your site root.</p>';
        self::action_form( 'cportfolio_export', 'Download published projects JSON' );
        echo '<form action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" method="post" enctype="multipart/form-data"><input type="hidden" name="action" value="cportfolio_import">'; wp_nonce_field( 'cportfolio_import' ); echo '<label>Portfolio JSON file (up to 2 MB) <input type="file" name="portfolio_json" accept=".json,application/json" required></label>'; submit_button( 'Import as drafts', 'secondary' ); echo '</form><p>This plugin preserves its data when deactivated or deleted. Export/back up before making changes. It does not take over an existing MU-plugin Work implementation.</p></div>';
    }
    private static function guard( string $action ): void { if ( ! current_user_can( 'manage_options' ) ) { wp_die( 'You cannot manage this portfolio.', '', [ 'response' => 403 ] ); } check_admin_referer( $action ); }
    private static function back(): void { wp_safe_redirect( admin_url( 'edit.php?post_type=' . self::TYPE . '&page=cportfolio-setup' ) ); exit; }
    public static function create_page(): void { self::guard( 'cportfolio_create_page' ); $existing = get_page_by_path( 'work' ); if ( $existing ) { self::notice( 'A Work page already exists. It was not changed. Add [portfolio] to that page or choose another page.' ); } else { $id = wp_insert_post( [ 'post_type' => 'page', 'post_status' => 'publish', 'post_title' => 'Work', 'post_name' => 'work', 'post_content' => '[portfolio]' ], true ); self::notice( is_wp_error( $id ) ? $id->get_error_message() : 'Work page created. Add and publish projects under Portfolio.' ); } self::back(); }
    public static function samples(): void { self::guard( 'cportfolio_samples' ); try { $data = json_decode( file_get_contents( __DIR__ . '/sample-portfolio.json' ), true, 64, JSON_THROW_ON_ERROR ); foreach ( $data['projects'] as &$p ) { foreach ( $p['evidence'] as &$item ) { if ( $item['src'] === 'media/workflow.svg' ) { $item['src'] = ltrim( wp_make_link_relative( plugins_url( 'sample-media/workflow.svg', __FILE__ ) ), '/' ); } } unset( $item ); } unset( $p ); $count = self::import_portfolio( $data ); self::notice( $count . ' fictional sample drafts added. Review and publish them individually.' ); } catch ( \Throwable $e ) { self::notice( $e->getMessage() ); } self::back(); }
    public static function import_action(): void { self::guard( 'cportfolio_import' ); try { $file = $_FILES['portfolio_json'] ?? []; if ( ( $file['error'] ?? UPLOAD_ERR_NO_FILE ) !== UPLOAD_ERR_OK || ( $file['size'] ?? 0 ) > 2 * 1024 * 1024 || ! is_uploaded_file( $file['tmp_name'] ?? '' ) ) { throw new \RuntimeException( 'Choose a valid JSON upload smaller than 2 MB.' ); } $data = json_decode( file_get_contents( $file['tmp_name'] ), true, 64, JSON_THROW_ON_ERROR ); $count = self::import_portfolio( $data ); self::notice( $count . ' new drafts imported. Existing matching IDs were skipped. Review media and publication permissions before publishing.' ); } catch ( \Throwable $e ) { self::notice( $e->getMessage() ); } self::back(); }
    public static function export_action(): void { self::guard( 'cportfolio_export' ); if ( self::published_query( 1, 1 )->found_posts > 1000 ) { wp_die( 'This export supports up to 1,000 public projects. No truncated file was produced. Use a full WordPress database backup for larger sites.' ); } $projects = []; for ( $page = 1; $page <= 10; $page++ ) { $batch = self::collection( $page, 100 )['projects']; $projects = array_merge( $projects, $batch ); if ( count( $batch ) < 100 ) { break; } } $data = self::collection(); $data['projects'] = $projects; self::validate( $data ); nocache_headers(); header( 'Content-Type: application/json; charset=utf-8' ); header( 'Content-Disposition: attachment; filename="portfolio.json"' ); echo wp_json_encode( $data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES ); exit; }

    public static function import_portfolio( array $data ): int {
        if ( ! current_user_can( 'manage_options' ) ) { throw new \RuntimeException( 'Administrator permission is required.' ); }
        self::validate( $data ); $data = self::clean( $data ); self::validate( $data ); $count = 0;
        foreach ( $data['projects'] as $p ) {
            $existing = get_posts( [ 'post_type' => self::TYPE, 'post_status' => [ 'publish', 'draft', 'private', 'pending', 'future', 'trash' ], 'meta_key' => '_cportfolio_portable_id', 'meta_value' => $p['id'], 'posts_per_page' => 1 ] ); if ( $existing ) { continue; }
            $post_id = wp_insert_post( [ 'post_type' => self::TYPE, 'post_status' => 'draft', 'post_title' => self::text( $p['title'] ), 'post_excerpt' => self::text( $p['summary'] ), 'post_name' => $p['slug'] ], true );
            if ( is_wp_error( $post_id ) ) { throw new \RuntimeException( $count . ' projects were imported before an error: ' . $post_id->get_error_message() ); }
            $clean = self::clean( $p ); $technology_map = [];
            foreach ( [ self::SYSTEM => 'systems', self::TECH => 'technologies' ] as $taxonomy => $field ) {
                $term_ids = [];
                foreach ( $p[ $field ] as $term ) {
                    $exists = term_exists( $term['label'], $taxonomy );
                    if ( ! $exists ) { $exists = wp_insert_term( self::text( $term['label'] ), $taxonomy ); }
                    if ( is_wp_error( $exists ) ) { throw new \RuntimeException( 'Draft ' . $post_id . ' was created, but a classification could not be saved. Review the draft before retrying.' ); }
                    $term_id = (int) ( is_array( $exists ) ? $exists['term_id'] : $exists );
                    $canonical = get_term_meta( $term_id, '_cportfolio_id', true ) ?: 'term-' . $term_id;
                    if ( $taxonomy === self::TECH ) { $technology_map[ $term['id'] ] = $canonical; }
                    $term_ids[] = $term_id;
                }
                wp_set_object_terms( $post_id, $term_ids, $taxonomy );
            }
            foreach ( $clean['implementations'] as &$implementation ) { $implementation['technologyIds'] = array_map( static fn( $id ) => $technology_map[ $id ], $implementation['technologyIds'] ); } unset( $implementation );
            update_post_meta( $post_id, self::META, wp_slash( $clean ) ); update_post_meta( $post_id, '_cportfolio_portable_id', $p['id'] );
            $count++;
        }
        return $count;
    }
    private static function clean( mixed $value ): mixed { if ( is_array( $value ) ) { return array_map( [ self::class, 'clean' ], $value ); } return is_string( $value ) ? self::text( $value ) : $value; }
    public static function wrap( array $projects ): array { return [ 'schemaVersion' => '0.1.0', 'title' => 'Portfolio', 'summary' => 'Project stories.', 'locale' => 'en', 'projects' => $projects ]; }

    public static function validate( array $data ): void {
        $schema = json_decode( file_get_contents( __DIR__ . '/portfolio.schema.json' ), true, 64, JSON_THROW_ON_ERROR ); self::validate_node( $schema, $data, $schema, 'Portfolio' );
        foreach ( [ 'id', 'slug' ] as $key ) { if ( count( array_unique( array_column( $data['projects'], $key ) ) ) !== count( $data['projects'] ) ) { throw new \RuntimeException( 'Duplicate project ' . $key ); } }
        foreach ( $data['projects'] as $p ) {
            foreach ( [ 'systems', 'technologies', 'implementations', 'evidence', 'results' ] as $key ) { if ( count( array_unique( array_column( $p[ $key ], 'id' ) ) ) !== count( $p[ $key ] ) ) { throw new \RuntimeException( 'Duplicate ' . $key . ' ID.' ); } }
            $evidence = array_column( $p['evidence'], 'id' ); $tech = array_column( $p['technologies'], 'id' ); $nodes = array_column( $p['architecture']['nodes'], 'id' ); if ( count( array_unique( $nodes ) ) !== count( $nodes ) ) { throw new \RuntimeException( 'Duplicate architecture node.' ); }
            foreach ( array_merge( array_values( $p['sections'] ), $p['implementations'], $p['results'] ) as $item ) { foreach ( $item['evidenceIds'] as $id ) { if ( ! in_array( $id, $evidence, true ) ) { throw new \RuntimeException( 'Unknown evidence reference.' ); } } }
            foreach ( $p['implementations'] as $item ) { foreach ( $item['technologyIds'] as $id ) { if ( ! in_array( $id, $tech, true ) ) { throw new \RuntimeException( 'Unknown technology reference.' ); } } }
            foreach ( $p['architecture']['edges'] as $edge ) { if ( ! in_array( $edge['from'], $nodes, true ) || ! in_array( $edge['to'], $nodes, true ) ) { throw new \RuntimeException( 'Unknown architecture endpoint.' ); } }
            foreach ( $p['evidence'] as $item ) { if ( ! self::safe_source( $item['src'] ) ) { throw new \RuntimeException( 'Evidence needs HTTPS or a safe relative media path.' ); } if ( $item['type'] === 'image' && ! trim( $item['alt'] ) ) { throw new \RuntimeException( 'Add alternative text to every image.' ); } }
        }
    }
    public static function safe_source( string $source ): bool {
        if ( $source === '' || preg_match( '/[\s\\\\\x00-\x1f\x7f]/', $source ) ) { return false; } $decoded = rawurldecode( $source );
        if ( preg_match( '/[\\\\\x00-\x1f\x7f%]/', $decoded ) || preg_match( '~(^|/)\.{1,2}(/|$)~', $decoded ) ) { return false; }
        if ( str_starts_with( $source, 'https://' ) ) { $url = wp_parse_url( $source ); return is_array( $url ) && ! empty( $url['host'] ) && empty( $url['user'] ) && empty( $url['pass'] ); }
        return (bool) preg_match( '~^[A-Za-z0-9][A-Za-z0-9_./-]*$~D', $decoded ) && ! in_array( '', explode( '/', $decoded ), true );
    }
    private static function validate_node( array $rule, mixed $value, array $schema, string $path ): void {
        if ( isset( $rule['$ref'] ) ) { self::validate_node( $schema['$defs'][ substr( $rule['$ref'], 8 ) ], $value, $schema, $path ); return; }
        $type = $rule['type']; $ok = match ( $type ) { 'object' => is_array( $value ) && ( ! array_is_list( $value ) || $value === [] ), 'array' => is_array( $value ) && array_is_list( $value ), 'string' => is_string( $value ), 'boolean' => is_bool( $value ), default => false };
        if ( ! $ok ) { throw new \RuntimeException( $path . ': expected ' . $type ); }
        if ( isset( $rule['enum'] ) && ! in_array( $value, $rule['enum'], true ) ) { throw new \RuntimeException( $path . ': unsupported value' ); }
        if ( $type === 'string' ) { $length = preg_match_all( '/./us', $value ); if ( ( isset( $rule['minLength'] ) && $length < $rule['minLength'] ) || ( isset( $rule['maxLength'] ) && $length > $rule['maxLength'] ) || ( isset( $rule['pattern'] ) && ! preg_match( '~' . $rule['pattern'] . '~uD', $value ) ) ) { throw new \RuntimeException( $path . ': invalid or overlong text' ); } }
        if ( $type === 'array' ) { if ( isset( $rule['maxItems'] ) && count( $value ) > $rule['maxItems'] ) { throw new \RuntimeException( $path . ': too many items' ); } if ( ! empty( $rule['uniqueItems'] ) && count( array_unique( array_map( 'serialize', $value ) ) ) !== count( $value ) ) { throw new \RuntimeException( $path . ': duplicate values' ); } foreach ( $value as $i => $item ) { self::validate_node( $rule['items'], $item, $schema, $path . '[' . $i . ']' ); } }
        if ( $type === 'object' ) { foreach ( $rule['required'] ?? [] as $key ) { if ( ! array_key_exists( $key, $value ) ) { throw new \RuntimeException( $path . ': missing ' . $key ); } } foreach ( $value as $key => $item ) { if ( ! array_key_exists( $key, $rule['properties'] ) ) { throw new \RuntimeException( $path . ': unsupported field ' . $key ); } self::validate_node( $rule['properties'][ $key ], $item, $schema, $path . '.' . $key ); } }
    }
    public static function routes(): void { register_rest_route( 'portfolio/v1', '/projects', [ 'methods' => 'GET', 'permission_callback' => '__return_true', 'args' => [ 'page' => [ 'default' => 1, 'sanitize_callback' => 'absint' ] ], 'callback' => static fn( $request ) => rest_ensure_response( self::collection( max( 1, (int) $request['page'] ), 50 ) ) ] ); }
}

Plugin::boot();
register_activation_hook( __FILE__, [ Plugin::class, 'activate' ] );
register_deactivation_hook( __FILE__, [ Plugin::class, 'deactivate' ] );
