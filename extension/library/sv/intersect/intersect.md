**`intersect`** — overlap of two sequences or bin values

In assertions, `s1 intersect s2` matches when both sequences start and end at the same times. In a cross, `binsof(cp) intersect {values}` selects bins that contain those values.

```systemverilog
property p_same_len;
  @(posedge clk) (req ##[1:5] ack) intersect (start ##3 done);
endproperty
```
