**`uvm_cmdline_processor`** — read simulator command-line arguments from the testbench

A singleton that captures the full command line and offers search functions over it. It is how the library implements its own plusargs (`+UVM_TESTNAME`, `+UVM_VERBOSITY`, `+uvm_set_*`), and it gives testbench code a richer alternative to `$value$plusargs`: every match of an argument, not only the first, and glob or regular-expression matching.

**Declaration**

```systemverilog
class uvm_cmdline_processor extends uvm_report_object;
    static function uvm_cmdline_processor get_inst();

    function void   get_args        (output string args[$]);
    function void   get_plusargs    (output string args[$]);
    function void   get_uvm_args    (output string args[$]);
    function int    get_arg_matches (string match, ref string args[$]);
    function int    get_arg_value   (string match, ref string value);
    function int    get_arg_values  (string match, ref string values[$]);
    function string get_tool_name   ();
    function string get_tool_version();
```

| Method | Returns |
| --- | --- |
| `get_arg_matches("+foo*", args)` | All arguments matching a glob, or a regex written as `/.../` |
| `get_arg_value("+SEQ=", value)` | The text after the prefix for the first match; the count of matches as return value |
| `get_arg_values("+WAIVE=", values)` | The text after the prefix for every match |

**Example**

```systemverilog
function void build_phase(uvm_phase phase);
    uvm_cmdline_processor clp = uvm_cmdline_processor::get_inst();
    string value;
    string waivers[$];

    if (clp.get_arg_value("+N_ITEMS=", value))
        n_items = value.atoi();

    void'(clp.get_arg_values("+WAIVE=", waivers));
    foreach (waivers[i])
        env.set_report_id_action_hier(waivers[i], UVM_NO_ACTION);

    `uvm_info("TEST", {"simulator: ", clp.get_tool_name(), " ", clp.get_tool_version()}, UVM_LOW)
endfunction
```

```
xrun ... +N_ITEMS=200 +WAIVE=FIFO_ENV +WAIVE=FIFO_WR_MON
```

**Notes**

- `get_arg_value` returns the number of matches and warns nothing if there are several; it simply uses the first.
- The global `uvm_cmdline_proc` constant holds the same instance in UVM 1.1.

**See also**: `UVM_TESTNAME`, `UVM_VERBOSITY`, `uvm_set_verbosity`, `uvm_config_db`
