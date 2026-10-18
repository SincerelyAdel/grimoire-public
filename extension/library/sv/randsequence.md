**`randsequence`** — random generation from grammar rules

Defines productions like a grammar and walks them, choosing among alternatives (optionally weighted with `:=`) at random. Productions can carry code blocks, arguments and return values. Useful for generating legal sequences of operations.

```systemverilog
randsequence (main)
  main  : setup ops teardown;
  ops   : op | op ops;
  op    : rd := 3 | wr := 1;
  rd    : { send_read(); };
  wr    : { send_write(); };
  setup : { reset_dut(); };
  teardown : { check_all(); };
endsequence
```
