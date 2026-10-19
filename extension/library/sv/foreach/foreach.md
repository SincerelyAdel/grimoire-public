**`foreach`** — loop over the indices of an array

Iterates over every index of an array, in order, without writing the bounds. Works with fixed, dynamic and associative arrays and queues. List one variable per dimension; skip a dimension with an empty slot (`arr[i, , k]`). The index variables are implicitly declared and read-only.

```systemverilog
int q[$] = '{3, 1, 4};
foreach (q[i])
  $display("q[%0d] = %0d", i, q[i]);

logic [7:0] mem [4][16];
foreach (mem[row, col]) mem[row][col] = '0;
```
