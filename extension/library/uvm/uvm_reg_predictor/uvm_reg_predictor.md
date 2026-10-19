**`uvm_reg_predictor`** — keeps the register model's mirror in step with observed bus traffic

A component that subscribes to the bus monitor. For every bus transaction it sees, it uses the adapter to convert the item to a register operation, looks up the register at that address in the map, and updates the mirrored value according to the fields' access policies. Because it works from the monitor, it captures accesses from any source, not only the register model's own calls.

**Declaration**

```systemverilog
class uvm_reg_predictor #(type BUSTYPE = int) extends uvm_component;
    uvm_analysis_imp  #(BUSTYPE, uvm_reg_predictor #(BUSTYPE)) bus_in;
    uvm_analysis_port #(uvm_reg_item)                          reg_ap;
    uvm_reg_map     map;
    uvm_reg_adapter adapter;

    function new(string name, uvm_component parent);
    virtual function void pre_predict(uvm_reg_item rw);
```

| Member | Meaning |
| --- | --- |
| `bus_in` | Connect the bus monitor's analysis port here |
| `reg_ap` | Publishes each completed register-level access, useful for register coverage and checkers |
| `map` | The address map used to find the register |
| `adapter` | The adapter used to interpret bus items |
| `pre_predict` | Hook called before the mirror is updated |

**Example**

```systemverilog
class fifo_env extends uvm_env;
    fifo_reg_block                       regmodel;
    apb_reg_adapter                      adapter;
    uvm_reg_predictor #(apb_transaction) predictor;
    apb_agent                            apb_agt;

    function void build_phase(uvm_phase phase);
        super.build_phase(phase);
        apb_agt   = apb_agent::type_id::create("apb_agt", this);
        adapter   = apb_reg_adapter::type_id::create("adapter");
        predictor = uvm_reg_predictor #(apb_transaction)::type_id::create("predictor", this);
        regmodel  = fifo_reg_block::type_id::create("regmodel");
        regmodel.build();
    endfunction

    function void connect_phase(uvm_phase phase);
        regmodel.default_map.set_sequencer(apb_agt.sqr, adapter);
        regmodel.default_map.set_auto_predict(0);

        predictor.map     = regmodel.default_map;
        predictor.adapter = adapter;
        apb_agt.ap.connect(predictor.bus_in);
    endfunction
endclass
```

**Notes**

- Turn auto-prediction off when using an explicit predictor, or the mirror is updated twice.
- When a register is wider than the bus, the predictor collects the individual bus cycles and predicts once the whole register has been accessed.
- An access to an address that maps to no register is reported at `UVM_HIGH` verbosity and otherwise ignored.

**See also**: `uvm_reg_map`, `uvm_reg_adapter`, `uvm_reg_block`, `uvm_reg`, `uvm_analysis_imp`
