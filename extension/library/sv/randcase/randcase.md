**`randcase`** — case that picks a branch at random by weight

Each item has a weight; one item runs, with probability equal to its weight divided by the sum of weights. Weights are evaluated each time and can be expressions. A weight of zero disables an item.

```systemverilog
randcase
  70: send_read();
  25: send_write();
  5:  send_error();
endcase
```
