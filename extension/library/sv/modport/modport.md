**`modport`** — directional view of an interface

Declared inside an interface. Lists which signals a module using that view sees as inputs and which as outputs, so the same interface serves both ends of a connection.

```systemverilog
modport master (output valid, data, input ready);

module driver (bus_if.master bus);
```
