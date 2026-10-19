**`UVM_MEDIUM`** — verbosity level 200: normal progress, the default threshold

One of the six `uvm_verbosity` levels. A message issued at `UVM_MEDIUM` is printed when the reporting component's verbosity threshold is `UVM_MEDIUM` or higher.

| Level | Value | Shown at the default threshold (`UVM_MEDIUM`) |
| --- | --- | --- |
| `UVM_NONE` | 0 | Yes, always |
| `UVM_LOW` | 100 | Yes |
| `UVM_MEDIUM` | 200 | Yes |
| `UVM_HIGH` | 300 | No |
| `UVM_FULL` | 400 | No |
| `UVM_DEBUG` | 500 | No |

**Use it for**

Messages you want in an ordinary interactive run but not necessarily in a regression: sequence start and end, one line per high-level transaction. This is the default threshold, so anything at this level or below is printed unless the verbosity is lowered.

**Example**

```systemverilog
`uvm_info("FIFO_WR_SEQ", $sformatf("sending %0d item(s)", n_items), UVM_MEDIUM)
```

**See also**: `uvm_verbosity`, `uvm_info`, `UVM_VERBOSITY`, `set_report_verbosity_level`
