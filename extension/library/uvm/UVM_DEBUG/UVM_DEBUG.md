**`UVM_DEBUG`** — verbosity level 500: lowest-level debug

One of the six `uvm_verbosity` levels. A message issued at `UVM_DEBUG` is printed when the reporting component's verbosity threshold is `UVM_DEBUG` or higher.

| Level | Value | Shown at the default threshold (`UVM_MEDIUM`) |
| --- | --- | --- |
| `UVM_NONE` | 0 | Yes, always |
| `UVM_LOW` | 100 | Yes |
| `UVM_MEDIUM` | 200 | Yes |
| `UVM_HIGH` | 300 | No |
| `UVM_FULL` | 400 | No |
| `UVM_DEBUG` | 500 | No |

**Use it for**

Signal-level tracing and messages that only matter when the testbench itself is suspected. The UVM library also uses this level for some of its own tracing, so `+UVM_VERBOSITY=UVM_DEBUG` on the whole testbench adds library output as well.

**Example**

```systemverilog
`uvm_info("FIFO_WR_DRV", $sformatf("wr_en=%0b data_in=0x%0h full=%0b", vif.wr_en, vif.data_in, vif.full), UVM_DEBUG)
```

**See also**: `uvm_verbosity`, `uvm_info`, `UVM_VERBOSITY`, `set_report_verbosity_level`
