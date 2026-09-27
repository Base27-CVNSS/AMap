# Runtime lifecycle

```text
load configuration
   -> initialize policy/privacy
   -> register endpoints
   -> register providers
   -> resolve engine dependency graph
   -> start engines
   -> capability gate
   -> application ready
   -> collect diagnostics
   -> stop engines in reverse order
```

The engine registry already performs topological startup and reverse shutdown.

Runtime-specific permission requests remain behind `PermissionProvider`; the core does not assume Android, iOS or browser permission APIs.
