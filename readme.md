# 🏢 Application Under Development for Lecico Egypt

<p align="center">
  <img src="https://via.placeholder.com/900x250.png?text=Lecico+TM1+Platform" alt="Project Banner" />
</p>

<p align="center">
  <i>A secure and structured platform built to manage and control TM1 operations with improved visibility, governance, and usability.</i>
</p>

---

## Overview

This application is being developed to provide a secure and structured interface over TM1 systems.  
It enhances control over cube-level operations while ensuring proper separation between backend logic and frontend interaction.

---

## Key Features

- Secure access layer over TM1  
- Cube-wise controlled data interaction  
- Centralized REST API communication  
- Dedicated logging and activity tracking system  
- Separation between backend and frontend layers  
- Improved monitoring, auditing, and traceability  

---

## Backend (Python)

The backend acts as a security and control layer over TM1, enabling safe and structured access to data through REST APIs and cube-wise operations.

### Responsibilities

- Secure communication with TM1 environment  
- Cube-level data management and control  
- Structured request/response handling  

### Logging & Tracking

A dedicated logging system operates independently from core logic to ensure full observability:

- Tracks user and system actions  
- Provides audit trails for all operations  
- Supports monitoring and administrative review  

---

## 🗄️ Database Architecture (SQLite)

The backend relies on a lightweight, local SQLite database for application state management, accessed via a centralized, thread-safe `DatabaseManager` object.

### Core Tables

| Table | Purpose | Security & Control |
|---|---|---|
| **Users** | Application-level user accounts | Passwords hashed securely via `bcrypt` |
| **TM1_Instances** | TM1 server connection details | Stores host endpoints, ports, and SSL settings |
| **TM1_Users** | TM1-specific credentials | Allows backend to query TM1 on behalf of users |
| **Pages** | Application UI routes | Maintains available frontend views |
| **PageAccess** | Role-Based Access Control | Maps Application `Users` to allowed `Pages` |

### Key Manager Features

- 🔒 **Thread-Safe Connections**: Prevents database lockups during concurrent REST API requests.
- 🔄 **JSON-Ready Formatting**: Automatically converts SQLite rows into dictionary objects for seamless API responses.
- 🛡️ **Centralized Safety**: Operations are wrapped in context managers to ensure transactions are safely committed or rolled back.

---

## Frontend (React - Vite)

The frontend delivers a clean, responsive, and user-friendly interface designed for smooth navigation and efficient interaction.

### Responsibilities

- Display system data in an intuitive UI  
- Handle client-side routing seamlessly  
- Maintain structured application flow  