**`randc`** — random-cyclic class property

Like `rand`, but cycles through every legal value in a random order before repeating any. Best for small ranges, such as picking each of 16 IDs once.

```systemverilog
class id_gen;
  randc bit [3:0] id;   // all 16 values before any repeats
endclass
```
