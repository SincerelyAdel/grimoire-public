**`real`** — double-precision floating point

A 64-bit IEEE floating-point number, the C `double`. Converting to an integer rounds to the nearest value. Not synthesizable; use it in testbenches and models.

```systemverilog
real ratio = 2.0 / 3.0;
int  n     = $rtoi(ratio * 100);
```
