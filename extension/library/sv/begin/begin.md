**`begin`** — start of a sequential block

Groups statements so they run one after another and count as a single statement, closed by `end`. Needed wherever the syntax allows only one statement, such as the body of `if`, `for` or `always`. A label after `begin` (`begin : name`) names the block, lets you declare local variables in it, and must match an optional label after `end`.

```systemverilog
always_ff @(posedge clk) begin : count_up
  if (en) begin
    cnt   <= cnt + 1;
    wrap  <= (cnt == MAX);
  end
end : count_up
```
