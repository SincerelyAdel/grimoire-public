**`interconnect`** — typeless net for passing connections through

A net with no data type that only passes a signal between ports, taking its type from what it connects. Useful in netlists that pass user-defined net types through levels of hierarchy.

```systemverilog
interconnect bus_link;
child_a u_a (.p(bus_link));
child_b u_b (.p(bus_link));
```
