**`uvm_verbosity`** — the enum of message verbosity levels

Every `` `uvm_info `` carries a verbosity, and every report object has a verbosity threshold. A message is printed only when its verbosity is less than or equal to the threshold. Lower values are therefore more important: they survive stricter filtering.

**Declaration**

```systemverilog
typedef enum {
    UVM_NONE   = 0,
    UVM_LOW    = 100,
    UVM_MEDIUM = 200,
    UVM_HIGH   = 300,
    UVM_FULL   = 400,
    UVM_DEBUG  = 500
} uvm_verbosity;
```

| Level | Printed when the threshold is | Intended for |
| --- | --- | --- |
| `UVM_NONE` | anything | Messages that must never be filtered: results, fatal conditions |
| `UVM_LOW` | `UVM_LOW` or higher | Major milestones |
| `UVM_MEDIUM` | `UVM_MEDIUM` or higher | Normal progress; the default threshold |
| `UVM_HIGH` | `UVM_HIGH` or higher | Per-transaction detail |
| `UVM_FULL` | `UVM_FULL` or higher | Internal detail of components |
| `UVM_DEBUG` | `UVM_DEBUG` | Library and low-level debug |

**Setting the threshold**

```systemverilog
// Command line, whole testbench
+UVM_VERBOSITY=UVM_HIGH

// Command line, one component from time 0 of the run phase
+uvm_set_verbosity=uvm_test_top.env.wr_agt.*,_ALL_,UVM_FULL,run

// In code
env.wr_agt.drv.set_report_verbosity_level(UVM_HIGH);
env.set_report_verbosity_level_hier(UVM_LOW);
env.scb.set_report_id_verbosity("FIFO_SCB", UVM_FULL);
```

**Example**

```systemverilog
`uvm_info("FIFO_TEST", "starting main stimulus",              UVM_LOW)
`uvm_info("FIFO_WR_DRV", $sformatf("drove %s", req.convert2string()), UVM_HIGH)
`uvm_info("FIFO_WR_DRV", $sformatf("wr_en=%0b", vif.wr_en),   UVM_DEBUG)
```

**Notes**

- The values are spaced by 100 so that custom levels can sit between them; the verbosity argument is an `int`.
- Warnings, errors and fatals are issued at `UVM_NONE` by the macros, so the threshold never hides them.
- Agree on what each level means within a team, or `UVM_HIGH` becomes unusable.

**See also**: `uvm_info`, `UVM_VERBOSITY`, `set_report_verbosity_level`, `uvm_set_verbosity`, `uvm_severity`
