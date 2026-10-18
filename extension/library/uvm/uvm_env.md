**`uvm_env`** — base class for an environment, a reusable container of verification components

An environment groups the agents, scoreboards, coverage collectors and sub-environments that verify one block or interface set. It is the unit of reuse: a block-level environment is instantiated unchanged inside a larger chip-level environment.

**Declaration**

```systemverilog
virtual class uvm_env extends uvm_component;
    function new(string name = "env", uvm_component parent = null);
```

It adds nothing functional to `uvm_component`.

**Example**

```systemverilog
class fifo_env extends uvm_env;
    `uvm_component_utils(fifo_env)

    fifo_cfg        cfg;
    fifo_wr_agent   wr_agt;
    fifo_rd_agent   rd_agt;
    fifo_scoreboard scb;

    function new(string name = "fifo_env", uvm_component parent = null);
        super.new(name, parent);
    endfunction

    function void build_phase(uvm_phase phase);
        super.build_phase(phase);
        if (!uvm_config_db #(fifo_cfg)::get(this, "", "cfg", cfg))
            cfg = fifo_cfg::type_id::create("cfg");
        uvm_config_db #(fifo_cfg)::set(this, "*", "cfg", cfg);

        wr_agt = fifo_wr_agent::type_id::create("wr_agt", this);
        rd_agt = fifo_rd_agent::type_id::create("rd_agt", this);
        if (cfg.has_scoreboard)
            scb = fifo_scoreboard::type_id::create("scb", this);
    endfunction

    function void connect_phase(uvm_phase phase);
        super.connect_phase(phase);
        if (cfg.has_scoreboard) begin
            wr_agt.ap.connect(scb.wr_ap);
            rd_agt.ap.connect(scb.rd_ap);
        end
    endfunction
endclass
```

**Guidelines**

- The environment owns structure only. Stimulus choice belongs to the test.
- Drive its shape from a configuration object, so the same class works at block level and when reused passively at a higher level.
- Do not reference the DUT or a specific testbench top from inside the environment; receive interfaces through the configuration database.
- Connect analysis ports in `connect_phase`, after every child has been built.

**See also**: `uvm_agent`, `uvm_test`, `uvm_scoreboard`, `uvm_component`, `uvm_config_db`, `connect_phase`
