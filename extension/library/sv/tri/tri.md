**`tri`** — tri-state net

Identical to `wire`; the name documents that the net has tri-state drivers. Undriven bits are `z`.

```systemverilog
tri [7:0] data_bus;
assign data_bus = oe ? dout : 'z;
```
