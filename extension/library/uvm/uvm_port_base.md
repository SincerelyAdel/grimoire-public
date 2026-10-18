**`uvm_port_base`** — common base class of every TLM port, export and imp

Implements what all TLM connection objects share: the `connect` method, the bookkeeping of who is connected to whom, the minimum and maximum connection counts, and the resolution of those connections at the end of elaboration. You rarely name it directly, but its methods are the ones you call on any port.

**Declaration**

```systemverilog
virtual class uvm_port_base #(type IF = uvm_void) extends IF;
    function new(string name, uvm_component parent, uvm_port_type_e port_type,
                 int min_size = 0, int max_size = 1);

    virtual function void connect(this_type provider);
    function int  size();
    function int  max_size();
    function int  min_size();
    function bit  is_unbounded();
    function bit  is_port();
    function bit  is_export();
    function bit  is_imp();
    function void get_connected_to(ref uvm_port_list list);
    function void get_provided_to (ref uvm_port_list list);
    function void debug_connected_to(int level = 0, int max_level = -1);
    function void debug_provided_to (int level = 0, int max_level = -1);
    function uvm_port_base #(IF) get_if(int index = 0);
```

**Example: debugging connections**

```systemverilog
function void end_of_elaboration_phase(uvm_phase phase);
    env.wr_agt.mon.ap.debug_connected_to();      // prints the fan-out tree
    `uvm_info("TEST", $sformatf("wr monitor has %0d subscriber(s)", env.wr_agt.mon.ap.size()), UVM_LOW)
endfunction
```

**Notes**

- `connect` only records the request. The actual binding is resolved after `connect_phase`, in `resolve_bindings()`, which is why `size()` is only valid from `end_of_elaboration_phase` onward.
- Connection-count violations are reported then, as "connection count of N does not meet required minimum of M".
- `connect` must be called before the end of elaboration; a late call is an error.
- A port connected to itself, or connections that form a loop, are reported as errors.

**See also**: `uvm_analysis_port`, `uvm_blocking_put_port`, `connect_phase`, `end_of_elaboration_phase`
