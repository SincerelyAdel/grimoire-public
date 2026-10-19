**`enum`** — enumerated type

A type with a fixed set of named values. The base type is `int` unless one is given, and values count up from 0 unless assigned. Assigning a plain integer to an enum variable needs a cast.

```systemverilog
typedef enum logic [1:0] {IDLE, BUSY, DONE} state_e;
state_e state, next;
```
