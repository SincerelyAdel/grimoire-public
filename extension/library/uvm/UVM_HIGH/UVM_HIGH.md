**`UVM_HIGH`** — verbosity level 300: per-transaction detail

One of the six `uvm_verbosity` levels. A message issued at `UVM_HIGH` is printed when the reporting component's verbosity threshold is `UVM_HIGH` or higher.

| Level | Value | Shown at the default threshold (`UVM_MEDIUM`) |
| --- | --- | --- |
| `UVM_NONE` | 0 | Yes, always |
| `UVM_LOW` | 100 | Yes |
| `UVM_MEDIUM` | 200 | Yes |
| `UVM_HIGH` | 300 | No |
| `UVM_FULL` | 400 | No |
| `UVM_DEBUG` | 500 | No |

**Use it for**

Detail that is useful when debugging one component but too noisy for every run: every item a driver sends, every transaction a monitor publishes, every comparison a scoreboard makes. Hidden by default; enable with `+UVM_VERBOSITY=UVM_HIGH` or per component.

**Example**

```systemverilog
`uvm_info("FIFO_WR_DRV", $sformatf("driving %s", req.convert2string()), UVM_HIGH)
`uvm_info("FIFO_WR_MON", tr.convert2string(), UVM_HIGH)
```

**See also**: `uvm_verbosity`, `uvm_info`, `UVM_VERBOSITY`, `set_report_verbosity_level`
