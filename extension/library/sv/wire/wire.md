**`wire`** — net type

A net that takes its value from its drivers and holds no state. It may have several drivers, which are resolved together, and it is driven by continuous assignments or port connections, never by procedural assignments.

```systemverilog
wire [7:0] bus;
assign bus = oe ? data : 'z;
```
