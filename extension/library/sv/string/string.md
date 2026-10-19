**`string`** — variable-length text

Holds characters of any length; empty is `""`. Supports comparison, `{}` concatenation and methods like `len()`, `substr()`, `toupper()`, `atoi()`, `itoa()` and `$sformatf` formatting. Not synthesizable.

```systemverilog
string name = "fifo";
string msg  = $sformatf("%s depth=%0d", name, 16);
if (msg.len() > 10) $display(msg.toupper());
```
