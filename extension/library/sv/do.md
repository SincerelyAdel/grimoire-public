**`do`** — loop that tests after each pass

`do statement while (condition);` runs the body once and then repeats it while the condition holds. Note the semicolon after the condition.

```systemverilog
do begin
  @(posedge clk);
  retries++;
end while (!ack && retries < 10);
```
