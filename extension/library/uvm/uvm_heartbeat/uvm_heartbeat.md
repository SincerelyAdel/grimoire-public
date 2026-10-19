**`uvm_heartbeat`** — watchdog that checks components keep showing activity

Monitors a list of components for activity on an objection. Each time a trigger event fires, the heartbeat checks that the watched components raised or dropped that objection since the previous trigger. If they did not, it reports a fatal `HBFAIL` error, which catches a testbench or DUT that has silently hung long before a global timeout would.

**Declaration**

```systemverilog
class uvm_heartbeat extends uvm_object;
    function new(string name, uvm_component cntxt, uvm_callbacks_objection objection = null);

    function uvm_heartbeat_modes set_mode(uvm_heartbeat_modes mode = UVM_NO_HB_MODE);
    function void set_heartbeat(uvm_event e, ref uvm_component comps[$]);
    function void add(uvm_component comp);
    function void remove(uvm_component comp);
    function void start(uvm_event e = null);
    function void stop();
```

| Mode | Requirement at each trigger |
| --- | --- |
| `UVM_ALL_ACTIVE` | Every watched component showed activity |
| `UVM_ANY_ACTIVE` | At least one did |
| `UVM_ONE_ACTIVE` | Exactly one did |

**Example**

```systemverilog
class fifo_env extends uvm_env;
    uvm_callbacks_objection hb_objection;
    uvm_heartbeat           hb;
    uvm_event               hb_tick;

    function void build_phase(uvm_phase phase);
        super.build_phase(phase);
        hb_objection = new("hb_objection");
        hb           = new("hb", this, hb_objection);
        hb_tick      = new("hb_tick");
    endfunction

    function void connect_phase(uvm_phase phase);
        uvm_component watched[$] = '{wr_agt.mon, rd_agt.mon};
        void'(hb.set_mode(UVM_ANY_ACTIVE));
        hb.set_heartbeat(hb_tick, watched);
    endfunction

    task run_phase(uvm_phase phase);
        forever #10us hb_tick.trigger();      // check window
    endtask
endclass

// In each monitor, whenever a transaction is seen:
hb_objection.raise_objection(this);
hb_objection.drop_objection(this);
```

**Notes**

- The objection must be a `uvm_callbacks_objection`, not a plain `uvm_objection`. In UVM 1.2 every objection supports the callbacks, and the type is a typedef.
- Choose the trigger period longer than the longest legal idle time, or legal gaps are reported as failures.

**See also**: `uvm_objection`, `uvm_event`, `set_timeout`, `UVM_TIMEOUT`
