**`vectored`** — vector net treated as a whole

Tells tools that the vector net will not be accessed bit by bit, which some tools use for optimization. Bit-selects of a `vectored` net may be disallowed.

```systemverilog
wire vectored [31:0] crc;
```
