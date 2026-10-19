**`UVM_NONE`** — verbosity level 0: always printed

One of the six `uvm_verbosity` levels. A message issued at `UVM_NONE` is printed when the reporting component's verbosity threshold is `UVM_NONE` or higher.

| Level | Value | Shown at the default threshold (`UVM_MEDIUM`) |
| --- | --- | --- |
| `UVM_NONE` | 0 | Yes, always |
| `UVM_LOW` | 100 | Yes |
| `UVM_MEDIUM` | 200 | Yes |
| `UVM_HIGH` | 300 | No |
| `UVM_FULL` | 400 | No |
| `UVM_DEBUG` | 500 | No |

**Use it for**

Messages that must appear in every run regardless of settings: the final PASS/FAIL line, the seed, configuration that is needed to reproduce a run. `+UVM_VERBOSITY=UVM_NONE` silences everything except these and the warnings, errors and fatals, which are also issued at this level.

**Example**

```systemverilog
`uvm_info("TEST", "*** TEST PASSED ***", UVM_NONE)
`uvm_info("TEST", $sformatf("seed = %0d", $get_initial_random_seed()), UVM_NONE)
```

**See also**: `uvm_verbosity`, `uvm_info`, `UVM_VERBOSITY`, `set_report_verbosity_level`
