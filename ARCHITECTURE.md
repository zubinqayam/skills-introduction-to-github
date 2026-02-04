# Architecture Diagrams

## System Overview

```
┌─────────────────────────────────────────────────────┐
│               MapCore DeepReview System              │
├─────────────┬─────────────┬─────────────────────────┤
│   Mapping   │   Registry  │     DeepReview          │
│  Engine     │   Layer     │     Protocol            │
├─────────────┼─────────────┼─────────────────────────┤
│ • Hierarchical │ • Master   │ • Pre-Mapping          │
│   Classifier  │   Registry │   Validation            │
│ • Recursive   │ • Version  │ • Post-Mapping          │
│   Aggregator  │   Control  │   Verification          │
│ • Map Builder │ • Access   │ • Integrity Hash        │
│               │   Control  │   Generation            │
│               │ • Sync     │ • Audit Trail           │
│               │   Engine   │   Generation            │
└─────────────┴─────────────┴─────────────────────────┘
```

## Data Flow Pipeline

```
Input: Unstructured Data
        ↓
┌───────────────────────┐
│  Phase 1: Ingestion   │
│  • Content Extraction │
│  • Metadata Capture   │
│  • Format Detection   │
└───────────────────────┘
        ↓
┌───────────────────────┐
│  Pre-Mapping Review   │
│  • Point-by-point     │
│    validation         │
│  • Word-by-word       │
│    verification       │
│  • Initial hash       │
│    generation         │
└───────────────────────┘
        ↓
┌───────────────────────┐
│  Phase 2: Mapping     │
│  • Hierarchical       │
│    classification     │
│  • Recursive          │
│    aggregation        │
│  • Structure building │
└───────────────────────┘
        ↓
┌───────────────────────┐
│  Post-Mapping Review  │
│  • Structure verify   │
│  • Completeness check │
│  • Hash integrity     │
│    verification       │
└───────────────────────┘
        ↓
┌───────────────────────┐
│  Phase 3: Registry    │
│  • Data storage       │
│  • Version tracking   │
│  • Access control     │
└───────────────────────┘
        ↓
Output: Hierarchical Mapped Data
```

## Hierarchical Structure

```
Topic (T-xxxx)
│
├── Subtopic 1 (ST-xxxx)
│   │
│   ├── Subject 1 (S-xxxx)
│   │   │
│   │   ├── Matter 1 (M-xxxx)
│   │   │   ├── content_hash: sha256:...
│   │   │   └── metadata
│   │   │
│   │   └── Matter 2 (M-xxxx)
│   │       ├── content_hash: sha256:...
│   │       └── metadata
│   │
│   └── Subject 2 (S-xxxx)
│       └── Matter 3 (M-xxxx)
│
└── Subtopic 2 (ST-xxxx)
    └── Subject 3 (S-xxxx)
        └── Matter 4 (M-xxxx)
```

## Component Interaction

```
┌─────────────────────────────────────────────────────────────┐
│                     User Application                         │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                  MapCoreDeepReview Class                     │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Ingestion   │  │   Mapping    │  │  DeepReview  │      │
│  │   Module     │→ │   Engine     │→ │   Protocol   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│          │                 │                   │             │
│          ↓                 ↓                   ↓             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Registry Layer                           │  │
│  │  • Master Registry    • Version Control               │  │
│  │  • Access Control     • Sync Engine                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Security Model

```
┌─────────────────────────────────────────┐
│           Data Integrity                 │
├─────────────────────────────────────────┤
│                                          │
│  Input Data                              │
│       ↓                                  │
│  SHA-256 Hash Generation                 │
│       ↓                                  │
│  Pre-Mapping Validation                  │
│       ↓                                  │
│  Hierarchical Mapping                    │
│       ↓                                  │
│  Post-Mapping Verification               │
│       ↓                                  │
│  Hash Integrity Check                    │
│       ↓                                  │
│  Audit Trail Logging                     │
│       ↓                                  │
│  Stored with Access Control              │
│                                          │
└─────────────────────────────────────────┘
```

## Version Control Flow

```
Initial Registration
        ↓
┌────────────────────┐
│  Master Registry   │
│  Entry Created     │
│  Version: 0        │
└────────────────────┘
        ↓
    Modification
        ↓
┌────────────────────┐
│  New Version       │
│  Created           │
│  Version: 1        │
│  + Comment         │
│  + Timestamp       │
└────────────────────┘
        ↓
┌────────────────────┐
│  Master Registry   │
│  Updated           │
│  Version History   │
│  Maintained        │
└────────────────────┘
```

## Access Control Model

```
┌─────────────────────────────────────┐
│         Access Control               │
├─────────────────────────────────────┤
│                                      │
│  User Request                        │
│       ↓                              │
│  Check Permissions                   │
│       ↓                              │
│  ┌──────────┐   ┌──────────┐       │
│  │  READ    │   │  WRITE   │       │
│  │  Access  │   │  Access  │       │
│  └──────────┘   └──────────┘       │
│       ↓              ↓               │
│  Grant Access   Grant Access        │
│       ↓              ↓               │
│  Audit Log      Audit Log           │
│                                      │
└─────────────────────────────────────┘
```
