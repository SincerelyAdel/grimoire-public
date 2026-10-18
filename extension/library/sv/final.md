**`final`** — process that runs once at the end of simulation

Runs when simulation finishes, for example after `$finish`. It executes in zero time, so it cannot contain delays or event controls. Used for summaries and end-of-test checks.

```systemverilog
final $display("errors: %0d", error_count);
```
