**`UVM_FULL`** — verbosity level 400: internal detail

One of the six `uvm_verbosity` levels. A message issued at `UVM_FULL` is printed when the reporting component's verbosity threshold is `UVM_FULL` or higher.

| Level | Value | Shown at the default threshold (`UVM_MEDIUM`) |
| --- | --- | --- |
| `UVM_NONE` | 0 | Yes, always |
| `UVM_LOW` | 100 | Yes |
| `UVM_MEDIUM` | 200 | Yes |
| `UVM_HIGH` | 300 | No |
| `UVM_FULL` | 400 | No |
| `UVM_DEBUG` | 500 | No |

**Use it for**

Step-by-step internals of a component: state changes inside a driver, each cycle of a protocol handshake, the contents of queues. Enable it for one component at a time, as a whole testbench at this level produces very large logs.

**Example**

```systemverilog
`uvm_info("FIFO_WR_DRV", $sformatf("waiting %0d cycle(s) before wr_en", item.delay), UVM_FULL)
`uvm_info("FIFO_SCB", $sformatf("expected queue depth = %0d", expected.size()), UVM_FULL)
```

**See also**: `uvm_verbosity`, `uvm_info`, `UVM_VERBOSITY`, `set_report_verbosity_level`
