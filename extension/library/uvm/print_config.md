**`print_config`** — debug what the configuration database holds for a component (`print_config`, `print_config_settings`, `check_config_usage`)

Component methods for inspecting configuration. They answer the two usual questions: which settings are visible to this component, and which settings were made but never read by anyone.

**Signatures**

```systemverilog
function void print_config(bit recurse = 0, bit audit = 0);
function void print_config_with_audit(bit recurse = 0);
function void print_config_settings(string field = "", uvm_component comp = null, bit recurse = 0);
function void check_config_usage(bit recurse = 1);
```

| Method | Shows |
| --- | --- |
| `print_config(recurse, audit)` | Every resource visible to this component: name, type and value. With `audit`, also who read and wrote each one, and when. With `recurse`, the same for all children. |
| `print_config_with_audit(recurse)` | Shorthand for `print_config(recurse, 1)` |
| `print_config_settings(...)` | The older form; deprecated in favour of `print_config` |
| `check_config_usage(recurse)` | Settings that were written but never read: usually a wrong path, name or type |

**Example**

```systemverilog
function void end_of_elaboration_phase(uvm_phase phase);
    super.end_of_elaboration_phase(phase);

    // What can the write driver see?
    env.wr_agt.drv.print_config(0, 1);

    // What did we set that nobody used?
    check_config_usage();
endfunction
```

Typical `check_config_usage` output for a misspelt scope:

```
::: The following resources have at least one write and no reads :::
vif [/^uvm_test_top\.env\.wr_agnt\..*$/] : (virtual interface fifo_if) ?
```

**Notes**

- Run these at `end_of_elaboration_phase` or later, after every `build_phase` has done its `get` calls.
- An unread setting is the signature of the three common mistakes: a path that matches nothing, a field name that differs between `set` and `get`, or a type parameter that differs.
- `+UVM_CONFIG_DB_TRACE` gives the complementary view: every `set` and `get` as it happens, including the failed lookups.
- `uvm_resource_db #(T)::dump()` prints the entire pool regardless of scope.

**See also**: `uvm_config_db`, `uvm_resource_db`, `UVM_CONFIG_DB_TRACE`, `end_of_elaboration_phase`, `set_config_int`
