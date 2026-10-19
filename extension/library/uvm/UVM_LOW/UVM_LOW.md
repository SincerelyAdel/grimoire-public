**`UVM_LOW`** — verbosity level 100: important milestones

One of the six `uvm_verbosity` levels. A message issued at `UVM_LOW` is printed when the reporting component's verbosity threshold is `UVM_LOW` or higher.

| Level | Value | Shown at the default threshold (`UVM_MEDIUM`) |
| --- | --- | --- |
| `UVM_NONE` | 0 | Yes, always |
| `UVM_LOW` | 100 | Yes |
| `UVM_MEDIUM` | 200 | Yes |
| `UVM_HIGH` | 300 | No |
| `UVM_FULL` | 400 | No |
| `UVM_DEBUG` | 500 | No |

**Use it for**

A small number of messages that summarise what the test is doing: reset finished, each stage of the test starting, final statistics. A regression run at `+UVM_VERBOSITY=UVM_LOW` should produce a short, readable log.

**Example**

```systemverilog
`uvm_info("FIFO_TEST", "reset released, starting write burst", UVM_LOW)
`uvm_info("FIFO_SCB", $sformatf("%0d match, %0d mismatch", n_match, n_mismatch), UVM_LOW)
```

**See also**: `uvm_verbosity`, `uvm_info`, `UVM_VERBOSITY`, `set_report_verbosity_level`
