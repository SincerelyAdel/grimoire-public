**`build_phase`** — the phase in which a component gets its configuration and creates its children

The first phase. It is a function, runs in zero time, and executes top-down: the test builds first, then the environment it created, then the agents, and so on. This order is what lets a parent configure a child before the child builds itself.

**Signature**

```systemverilog
virtual function void build_phase(uvm_phase phase);
```

**What belongs here**

1. `super.build_phase(phase);`
2. Read configuration with `uvm_config_db::get()`.
3. Publish configuration for children with `uvm_config_db::set()`.
4. Create child components with `type_id::create("name", this)`.
5. Construct TLM ports, exports and imps, if not done in the constructor.

**Rules**

- Components can only be created here or earlier. Creating one in a later phase is a fatal error.
- Because the order is top-down, a `set()` in the parent's `build_phase` must come before the `create()` of the child that reads it. Children do not exist yet, so you cannot call methods on them; pass information through the configuration database.
- Do not touch sibling or child internals here: nothing below you has been built.
- Do not connect ports here; do that in `connect_phase`, when everything exists.
- `super.build_phase(phase)` is required when the class uses field automation, and in `uvm_agent` subclasses to pick up `is_active`. Calling it always is the safe habit.

**Notes**

- Factory overrides must be set before the affected `create()` call, so tests place them at the top of their own `build_phase`, before `super.build_phase` if the base test creates the environment.
- If any `UVM_ERROR` is reported during this phase, the library ends the run with a `BUILDERR` fatal once the phase completes.
- The OVM-style `build()` method still works in UVM 1.1 but is deprecated.

**See also**: `connect_phase`, `end_of_elaboration_phase`, `uvm_config_db`, `type_id`, `uvm_component`, `uvm_phase`

---

**Coding example**

```systemverilog
class fifo_wr_agent extends uvm_agent;
    `uvm_component_utils(fifo_wr_agent)

    fifo_cfg        cfg;
    fifo_sequencer  sqr;
    fifo_wr_driver  drv;
    fifo_wr_monitor mon;

    function void build_phase(uvm_phase phase);
        super.build_phase(phase);

        if (!uvm_config_db #(fifo_cfg)::get(this, "", "cfg", cfg))
            `uvm_fatal("FIFO_WR_AGT", "no cfg set for fifo_wr_agent")

        mon = fifo_wr_monitor::type_id::create("mon", this);
        if (get_is_active() == UVM_ACTIVE) begin
            sqr = fifo_sequencer::type_id::create("sqr", this);
            drv = fifo_wr_driver::type_id::create("drv", this);
        end
    endfunction
endclass
```

---

**Visual**

<img src="behavior.svg" width="300">
