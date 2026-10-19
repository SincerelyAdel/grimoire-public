**`uvm_root`** — the implicit top-level component and phase controller

A singleton that is the parent of every component created with a `null` parent. It owns the phasing engine, creates the test, holds the global timeout and provides searches over the whole hierarchy. Its one instance is available as `uvm_top` (UVM 1.1) or through `uvm_root::get()`.

**Declaration**

```systemverilog
class uvm_root extends uvm_component;
    static function uvm_root get();
```

**Main methods**

| Method | Purpose |
| --- | --- |
| `run_test(string test_name = "")` | Create the test and run all phases |
| `print_topology(uvm_printer printer = null)` | Print the component tree |
| `find(string comp_match)` | First component whose full name matches a glob |
| `find_all(string comp_match, ref uvm_component comps[$], input uvm_component comp = null)` | All matches |
| `set_timeout(time timeout, bit overridable = 1)` | Global watchdog, default 9200 s |
| `stop_request()` | Legacy way to end the run phase |
| `die()` | Called on `UVM_EXIT`; reports and finishes |

**Useful fields**

| Field | Purpose |
| --- | --- |
| `enable_print_topology` | Set to 1 to print the hierarchy automatically at end of elaboration |
| `finish_on_completion` | Set to 0 to stop `run_test()` from calling `$finish` |
| `top_levels[$]` | Top-level components, normally just the test |

**Example**

```systemverilog
function void end_of_elaboration_phase(uvm_phase phase);
    uvm_root top = uvm_root::get();
    uvm_component drivers[$];

    top.print_topology();
    top.find_all("*.drv", drivers);
    `uvm_info("TEST", $sformatf("%0d driver(s) in the testbench", drivers.size()), UVM_LOW)
    top.set_timeout(10ms);
endfunction
```

**Notes**

- Reports issued by plain objects and by code outside any component go through `uvm_root`, which is why they show `reporter` as the source.
- In UVM 1.2 and IEEE 1800.2, obtain the handle with `uvm_root::get()` or `uvm_coreservice_t::get().get_root()`; the global `uvm_top` variable is deprecated in IEEE.

**See also**: `uvm_top`, `uvm_test_top`, `run_test`, `print_topology`, `set_timeout`, `uvm_coreservice_t`
