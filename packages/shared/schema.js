/* SPDX-License-Identifier: MIT; generated from schemas/portfolio.schema.json. */
(function(root) { const schema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://raw.githubusercontent.com/evrimaslan85/portfolio/main/schemas/portfolio.schema.json",
  "title": "Portfolio public exchange document",
  "description": "Design-stage v0.1 public content only. Validation is not publication approval.",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schemaVersion",
    "title",
    "summary",
    "locale",
    "projects"
  ],
  "properties": {
    "schemaVersion": {
      "type": "string",
      "enum": [
        "0.1.0"
      ]
    },
    "title": {
      "type": "string",
      "minLength": 1,
      "maxLength": 140
    },
    "summary": {
      "type": "string",
      "minLength": 1,
      "maxLength": 500
    },
    "locale": {
      "type": "string",
      "pattern": "^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$"
    },
    "projects": {
      "type": "array",
      "maxItems": 1000,
      "items": {
        "$ref": "#/$defs/project"
      }
    }
  },
  "$defs": {
    "id": {
      "type": "string",
      "pattern": "^[a-z][a-z0-9-]{0,79}$"
    },
    "shortText": {
      "type": "string",
      "minLength": 1,
      "maxLength": 500
    },
    "body": {
      "type": "string",
      "maxLength": 20000
    },
    "ids": {
      "type": "array",
      "maxItems": 100,
      "uniqueItems": true,
      "items": {
        "$ref": "#/$defs/id"
      }
    },
    "status": {
      "type": "string",
      "enum": [
        "live",
        "completed",
        "ongoing",
        "prototype"
      ]
    },
    "classification": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "label"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "label": {
          "type": "string",
          "minLength": 1,
          "maxLength": 100
        }
      }
    },
    "section": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "title",
        "body",
        "evidenceIds"
      ],
      "properties": {
        "title": {
          "type": "string",
          "minLength": 1,
          "maxLength": 140
        },
        "body": {
          "$ref": "#/$defs/body"
        },
        "evidenceIds": {
          "$ref": "#/$defs/ids"
        }
      }
    },
    "implementation": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "title",
        "summary",
        "details",
        "status",
        "technologyIds",
        "evidenceIds"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "title": {
          "type": "string",
          "minLength": 1,
          "maxLength": 140
        },
        "summary": {
          "$ref": "#/$defs/shortText"
        },
        "details": {
          "$ref": "#/$defs/body"
        },
        "status": {
          "$ref": "#/$defs/status"
        },
        "technologyIds": {
          "$ref": "#/$defs/ids"
        },
        "evidenceIds": {
          "$ref": "#/$defs/ids"
        }
      }
    },
    "node": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "label",
        "kind"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "label": {
          "type": "string",
          "minLength": 1,
          "maxLength": 140
        },
        "kind": {
          "type": "string",
          "enum": [
            "source",
            "process",
            "storage",
            "output"
          ]
        }
      }
    },
    "edge": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "from",
        "to",
        "label"
      ],
      "properties": {
        "from": {
          "$ref": "#/$defs/id"
        },
        "to": {
          "$ref": "#/$defs/id"
        },
        "label": {
          "type": "string",
          "maxLength": 140
        }
      }
    },
    "result": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "label",
        "value",
        "context",
        "provenance",
        "evidenceIds"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "label": {
          "type": "string",
          "minLength": 1,
          "maxLength": 140
        },
        "value": {
          "type": "string",
          "minLength": 1,
          "maxLength": 140
        },
        "context": {
          "$ref": "#/$defs/shortText"
        },
        "provenance": {
          "type": "string",
          "enum": [
            "illustrative",
            "reported",
            "measured"
          ]
        },
        "evidenceIds": {
          "$ref": "#/$defs/ids"
        }
      }
    },
    "evidence": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "type",
        "title",
        "src",
        "alt",
        "caption"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "type": {
          "type": "string",
          "enum": [
            "image",
            "video",
            "link"
          ]
        },
        "title": {
          "type": "string",
          "minLength": 1,
          "maxLength": 140
        },
        "src": {
          "type": "string",
          "minLength": 1,
          "maxLength": 2048
        },
        "alt": {
          "type": "string",
          "maxLength": 500
        },
        "caption": {
          "type": "string",
          "maxLength": 1000
        }
      }
    },
    "project": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "slug",
        "title",
        "summary",
        "status",
        "featured",
        "systems",
        "technologies",
        "sections",
        "implementations",
        "architecture",
        "results",
        "evidence"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "slug": {
          "$ref": "#/$defs/id"
        },
        "title": {
          "type": "string",
          "minLength": 1,
          "maxLength": 140
        },
        "summary": {
          "$ref": "#/$defs/shortText"
        },
        "status": {
          "$ref": "#/$defs/status"
        },
        "featured": {
          "type": "boolean"
        },
        "client": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "displayName"
          ],
          "properties": {
            "displayName": {
              "type": "string",
              "minLength": 1,
              "maxLength": 140
            }
          }
        },
        "systems": {
          "type": "array",
          "maxItems": 30,
          "items": {
            "$ref": "#/$defs/classification"
          }
        },
        "technologies": {
          "type": "array",
          "maxItems": 50,
          "items": {
            "$ref": "#/$defs/classification"
          }
        },
        "sections": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "overview",
            "challenge",
            "solution",
            "outcomes"
          ],
          "properties": {
            "overview": {
              "$ref": "#/$defs/section"
            },
            "challenge": {
              "$ref": "#/$defs/section"
            },
            "solution": {
              "$ref": "#/$defs/section"
            },
            "outcomes": {
              "$ref": "#/$defs/section"
            }
          }
        },
        "implementations": {
          "type": "array",
          "maxItems": 100,
          "items": {
            "$ref": "#/$defs/implementation"
          }
        },
        "architecture": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "nodes",
            "edges"
          ],
          "properties": {
            "nodes": {
              "type": "array",
              "maxItems": 100,
              "items": {
                "$ref": "#/$defs/node"
              }
            },
            "edges": {
              "type": "array",
              "maxItems": 200,
              "items": {
                "$ref": "#/$defs/edge"
              }
            }
          }
        },
        "results": {
          "type": "array",
          "maxItems": 100,
          "items": {
            "$ref": "#/$defs/result"
          }
        },
        "evidence": {
          "type": "array",
          "maxItems": 100,
          "items": {
            "$ref": "#/$defs/evidence"
          }
        }
      }
    }
  }
}; root.PortfolioSchema = schema; if (typeof module === 'object' && module.exports) module.exports = schema; })(globalThis);
