**`longint`** — 64-bit signed 2-state integer

A 64-bit 2-state integer, the C `long long`. Use `longint unsigned` for 0 to 2^64-1. Useful for addresses and counters wider than 32 bits in testbenches.

```systemverilog
longint unsigned addr = 64'hFFFF_0000_0000_0000;
```
