**`byte`** — 8-bit signed 2-state integer

Holds -128 to 127, with bits 0 or 1 only; `x` and `z` become 0. Declare `byte unsigned` for 0 to 255. Handy for byte buffers in testbenches.

```systemverilog
byte b = -5;
byte unsigned payload [$];
```
