`include "fifo_if.sv"

package fifo_pkg;
    import uvm_pkg::*;
    `include "uvm_macros.svh"

    typedef enum bit { FIFO_WRITE, FIFO_READ } fifo_op_e;

    class fifo_cfg extends uvm_object;
        `uvm_object_utils(fifo_cfg)

        int unsigned depth          = 8;
        bit          has_scoreboard = 1'b1;
        bit          has_coverage   = 1'b1;

        function new(string name = "fifo_cfg");
            super.new(name);
        endfunction

        virtual function string convert2string();
            return $sformatf("depth=%0d scoreboard=%0b coverage=%0b", depth, has_scoreboard, has_coverage);
        endfunction
    endclass

    class fifo_transaction extends uvm_sequence_item;
        `uvm_object_utils(fifo_transaction)

        rand fifo_op_e    op;
        rand logic [7:0]  data;
        rand int unsigned delay;
        bit               legal = 1'b1;

        constraint delay_c { delay inside {[0:3]}; }

        function new(string name = "fifo_transaction");
            super.new(name);
        endfunction

        virtual function void do_copy(uvm_object rhs);
            fifo_transaction rhs_;
            super.do_copy(rhs);
            if (!$cast(rhs_, rhs)) `uvm_fatal("FIFO_TR", "do_copy: type mismatch")
            op    = rhs_.op;
            data  = rhs_.data;
            delay = rhs_.delay;
            legal = rhs_.legal;
        endfunction

        virtual function bit do_compare(uvm_object rhs, uvm_comparer comparer);
            fifo_transaction rhs_;
            if (!$cast(rhs_, rhs)) return 0;
            return super.do_compare(rhs, comparer) && (data === rhs_.data);
        endfunction

        virtual function void do_print(uvm_printer printer);
            super.do_print(printer);
            printer.print_string("op", op.name());
            printer.print_int("data", uvm_bitstream_t'(data), $bits(data), UVM_HEX);
            printer.print_int("delay", uvm_bitstream_t'(delay), $bits(delay), UVM_DEC);
        endfunction

        virtual function string convert2string();
            return $sformatf("%s data=0x%02h delay=%0d %s", op.name(), data, delay, legal ? "legal" : "ILLEGAL");
        endfunction
    endclass

    class fifo_no_delay_transaction extends fifo_transaction;
        `uvm_object_utils(fifo_no_delay_transaction)

        constraint delay_c { delay == 0; }

        function new(string name = "fifo_no_delay_transaction");
            super.new(name);
        endfunction
    endclass

    typedef uvm_sequencer #(fifo_transaction) fifo_sequencer;

    class fifo_driver extends uvm_driver #(fifo_transaction);
        `uvm_component_utils(fifo_driver)

        virtual fifo_if vif;
        fifo_op_e       op;

        function new(string name = "fifo_driver", uvm_component parent = null);
            super.new(name, parent);
        endfunction

        function void build_phase(uvm_phase phase);
            super.build_phase(phase);
            if (!uvm_config_db #(virtual fifo_if)::get(this, "", "vif", vif))
                `uvm_fatal("FIFO_DRV", "No virtual interface set for fifo_driver.vif")
            if (!uvm_config_db #(fifo_op_e)::get(this, "", "op", op))
                `uvm_fatal("FIFO_DRV", "No op set for fifo_driver")
        endfunction

        task run_phase(uvm_phase phase);
            idle();
            @(posedge vif.rst_n);
            if (op == FIFO_WRITE) @(vif.wr_drv_cb);
            else                  @(vif.rd_drv_cb);
            forever begin
                seq_item_port.get_next_item(req);
                `uvm_info("FIFO_DRV", {"driving ", req.convert2string()}, UVM_HIGH)
                drive_item(req);
                seq_item_port.item_done();
            end
        endtask

        task idle();
            if (op == FIFO_WRITE) begin
                vif.wr_drv_cb.wr_en   <= 1'b0;
                vif.wr_drv_cb.data_in <= '0;
            end else begin
                vif.rd_drv_cb.rd_en <= 1'b0;
            end
        endtask

        task drive_item(fifo_transaction item);
            if (op == FIFO_WRITE) begin
                repeat (item.delay) @(vif.wr_drv_cb);
                vif.wr_drv_cb.data_in <= item.data;
                vif.wr_drv_cb.wr_en   <= 1'b1;
                @(vif.wr_drv_cb);
                vif.wr_drv_cb.wr_en   <= 1'b0;
            end else begin
                repeat (item.delay) @(vif.rd_drv_cb);
                vif.rd_drv_cb.rd_en <= 1'b1;
                @(vif.rd_drv_cb);
                vif.rd_drv_cb.rd_en <= 1'b0;
            end
        endtask
    endclass

    class fifo_monitor extends uvm_monitor;
        `uvm_component_utils(fifo_monitor)

        virtual fifo_if vif;
        fifo_op_e       op;
        uvm_analysis_port #(fifo_transaction) ap;

        function new(string name = "fifo_monitor", uvm_component parent = null);
            super.new(name, parent);
            ap = new("ap", this);
        endfunction

        function void build_phase(uvm_phase phase);
            super.build_phase(phase);
            if (!uvm_config_db #(virtual fifo_if)::get(this, "", "vif", vif))
                `uvm_fatal("FIFO_MON", "No virtual interface set for fifo_monitor.vif")
            if (!uvm_config_db #(fifo_op_e)::get(this, "", "op", op))
                `uvm_fatal("FIFO_MON", "No op set for fifo_monitor")
        endfunction

        task run_phase(uvm_phase phase);
            if (op == FIFO_WRITE) monitor_writes();
            else                  monitor_reads();
        endtask

        task monitor_writes();
            fifo_transaction tr;
            forever begin
                @(vif.mon_cb);
                if (vif.rst_n && vif.mon_cb.wr_en) begin
                    tr = fifo_transaction::type_id::create("tr");
                    tr.op    = FIFO_WRITE;
                    tr.data  = vif.mon_cb.data_in;
                    tr.legal = !vif.mon_cb.full;
                    `uvm_info("FIFO_MON", tr.convert2string(), UVM_HIGH)
                    ap.write(tr);
                end
            end
        endtask

        task monitor_reads();
            fifo_transaction tr;
            bit              pending;
            forever begin
                @(vif.mon_cb);
                if (pending) begin
                    tr = fifo_transaction::type_id::create("tr");
                    tr.op   = FIFO_READ;
                    tr.data = vif.mon_cb.data_out;
                    `uvm_info("FIFO_MON", tr.convert2string(), UVM_HIGH)
                    ap.write(tr);
                end
                pending = vif.rst_n && vif.mon_cb.rd_en && !vif.mon_cb.empty;
            end
        endtask
    endclass

    class fifo_agent extends uvm_agent;
        `uvm_component_utils(fifo_agent)

        fifo_sequencer sqr;
        fifo_driver    drv;
        fifo_monitor   mon;
        uvm_analysis_port #(fifo_transaction) ap;

        function new(string name = "fifo_agent", uvm_component parent = null);
            super.new(name, parent);
        endfunction

        function void build_phase(uvm_phase phase);
            super.build_phase(phase);
            mon = fifo_monitor::type_id::create("mon", this);
            if (get_is_active() == UVM_ACTIVE) begin
                sqr = fifo_sequencer::type_id::create("sqr", this);
                drv = fifo_driver::type_id::create("drv", this);
            end
        endfunction

        function void connect_phase(uvm_phase phase);
            super.connect_phase(phase);
            ap = mon.ap;
            if (get_is_active() == UVM_ACTIVE)
                drv.seq_item_port.connect(sqr.seq_item_export);
        endfunction
    endclass

    `uvm_analysis_imp_decl(_wr)
    `uvm_analysis_imp_decl(_rd)

    class fifo_scoreboard extends uvm_scoreboard;
        `uvm_component_utils(fifo_scoreboard)

        uvm_analysis_imp_wr #(fifo_transaction, fifo_scoreboard) wr_ap;
        uvm_analysis_imp_rd #(fifo_transaction, fifo_scoreboard) rd_ap;

        fifo_transaction expected[$];
        int unsigned     n_match;
        int unsigned     n_mismatch;
        int unsigned     n_rejected;

        function new(string name = "fifo_scoreboard", uvm_component parent = null);
            super.new(name, parent);
            wr_ap = new("wr_ap", this);
            rd_ap = new("rd_ap", this);
        endfunction

        function void write_wr(fifo_transaction tr);
            fifo_transaction kept;
            if (!tr.legal) begin
                n_rejected++;
                return;
            end
            if (!$cast(kept, tr.clone())) `uvm_fatal("FIFO_SCB", "clone failed")
            expected.push_back(kept);
        endfunction

        function void write_rd(fifo_transaction tr);
            fifo_transaction exp;
            if (expected.size() == 0) begin
                `uvm_error("FIFO_SCB", {"read with nothing expected: ", tr.convert2string()})
                return;
            end
            exp = expected.pop_front();
            if (tr.compare(exp)) n_match++;
            else begin
                n_mismatch++;
                `uvm_error("FIFO_SCB", $sformatf("got 0x%02h, expected 0x%02h", tr.data, exp.data))
            end
        endfunction

        function void check_phase(uvm_phase phase);
            super.check_phase(phase);
            if (n_match + n_mismatch == 0)
                `uvm_error("FIFO_SCB", "no transactions were compared")
        endfunction

        function void report_phase(uvm_phase phase);
            super.report_phase(phase);
            `uvm_info("FIFO_SCB", $sformatf("%0d match, %0d mismatch, %0d rejected write(s), %0d left in the FIFO",
                                             n_match, n_mismatch, n_rejected, expected.size()), UVM_LOW)
        endfunction
    endclass

    class fifo_coverage extends uvm_subscriber #(fifo_transaction);
        `uvm_component_utils(fifo_coverage)

        fifo_transaction tr;

        covergroup cg;
            data_cp:  coverpoint tr.data { bins zero = {8'h00}; bins max = {8'hFF}; bins others = default; }
            legal_cp: coverpoint tr.legal;
        endgroup

        function new(string name = "fifo_coverage", uvm_component parent = null);
            super.new(name, parent);
            cg = new();
        endfunction

        function void write(fifo_transaction t);
            tr = t;
            cg.sample();
        endfunction
    endclass

    class fifo_virtual_sequencer extends uvm_sequencer;
        `uvm_component_utils(fifo_virtual_sequencer)

        fifo_sequencer wr_sqr;
        fifo_sequencer rd_sqr;

        function new(string name = "fifo_virtual_sequencer", uvm_component parent = null);
            super.new(name, parent);
        endfunction
    endclass

    class fifo_env extends uvm_env;
        `uvm_component_utils(fifo_env)

        fifo_cfg               cfg;
        fifo_agent             wr_agt;
        fifo_agent             rd_agt;
        fifo_scoreboard        scb;
        fifo_coverage          cov;
        fifo_virtual_sequencer vsqr;

        function new(string name = "fifo_env", uvm_component parent = null);
            super.new(name, parent);
        endfunction

        function void build_phase(uvm_phase phase);
            super.build_phase(phase);
            if (!uvm_config_db #(fifo_cfg)::get(this, "", "cfg", cfg)) begin
                `uvm_warning("FIFO_ENV", "no cfg set, using defaults")
                cfg = fifo_cfg::type_id::create("cfg");
            end

            uvm_config_db #(fifo_op_e)::set(this, "wr_agt*", "op", FIFO_WRITE);
            uvm_config_db #(fifo_op_e)::set(this, "rd_agt*", "op", FIFO_READ);

            wr_agt = fifo_agent::type_id::create("wr_agt", this);
            rd_agt = fifo_agent::type_id::create("rd_agt", this);
            vsqr   = fifo_virtual_sequencer::type_id::create("vsqr", this);
            if (cfg.has_scoreboard) scb = fifo_scoreboard::type_id::create("scb", this);
            if (cfg.has_coverage)   cov = fifo_coverage::type_id::create("cov", this);
        endfunction

        function void connect_phase(uvm_phase phase);
            super.connect_phase(phase);
            if (cfg.has_scoreboard) begin
                wr_agt.ap.connect(scb.wr_ap);
                rd_agt.ap.connect(scb.rd_ap);
            end
            if (cfg.has_coverage) wr_agt.ap.connect(cov.analysis_export);
            if (wr_agt.get_is_active() == UVM_ACTIVE) vsqr.wr_sqr = wr_agt.sqr;
            if (rd_agt.get_is_active() == UVM_ACTIVE) vsqr.rd_sqr = rd_agt.sqr;
        endfunction
    endclass

    class fifo_item_seq extends uvm_sequence #(fifo_transaction);
        `uvm_object_utils(fifo_item_seq)

        rand int unsigned n_items = 16;
        fifo_op_e         kind    = FIFO_WRITE;

        constraint n_items_c { n_items inside {[1:64]}; }

        function new(string name = "fifo_item_seq");
            super.new(name);
        endfunction

        task body();
            repeat (n_items) begin
                req = fifo_transaction::type_id::create("req", , get_full_name());
                start_item(req);
                if (!req.randomize() with { op == kind; })
                    `uvm_error("FIFO_SEQ", "randomize failed")
                finish_item(req);
            end
        endtask
    endclass

    class fifo_virtual_seq extends uvm_sequence;
        `uvm_object_utils(fifo_virtual_seq)
        `uvm_declare_p_sequencer(fifo_virtual_sequencer)

        int unsigned n_per_stream = 24;

        function new(string name = "fifo_virtual_seq");
            super.new(name);
        endfunction

        task body();
            fifo_item_seq wr_seq = fifo_item_seq::type_id::create("wr_seq");
            fifo_item_seq rd_seq = fifo_item_seq::type_id::create("rd_seq");

            wr_seq.kind = FIFO_WRITE;
            rd_seq.kind = FIFO_READ;
            if (!wr_seq.randomize() with { n_items == n_per_stream; }) `uvm_error("FIFO_VSEQ", "randomize failed")
            if (!rd_seq.randomize() with { n_items == n_per_stream; }) `uvm_error("FIFO_VSEQ", "randomize failed")

            fork
                wr_seq.start(p_sequencer.wr_sqr, this);
                rd_seq.start(p_sequencer.rd_sqr, this);
            join
        endtask
    endclass

    class fifo_test extends uvm_test;
        `uvm_component_utils(fifo_test)

        fifo_env env;
        fifo_cfg cfg;

        function new(string name = "fifo_test", uvm_component parent = null);
            super.new(name, parent);
        endfunction

        function void build_phase(uvm_phase phase);
            super.build_phase(phase);
            cfg = fifo_cfg::type_id::create("cfg");
            uvm_config_db #(fifo_cfg)::set(this, "env", "cfg", cfg);
            env = fifo_env::type_id::create("env", this);
        endfunction

        function void end_of_elaboration_phase(uvm_phase phase);
            super.end_of_elaboration_phase(phase);
            uvm_top.print_topology();
            uvm_top.set_timeout(1ms);
        endfunction

        task run_phase(uvm_phase phase);
            fifo_virtual_seq vseq = fifo_virtual_seq::type_id::create("vseq");

            phase.raise_objection(this, "fifo_virtual_seq");
            vseq.start(env.vsqr);
            phase.phase_done.set_drain_time(this, 40);
            phase.drop_objection(this, "fifo_virtual_seq");
        endtask

        function void report_phase(uvm_phase phase);
            uvm_report_server server = uvm_report_server::get_server();
            int errors = server.get_severity_count(UVM_ERROR) + server.get_severity_count(UVM_FATAL);

            super.report_phase(phase);
            if (errors == 0) `uvm_info("FIFO_TEST", "*** TEST PASSED ***", UVM_NONE)
            else             `uvm_info("FIFO_TEST", $sformatf("*** TEST FAILED: %0d error(s) ***", errors), UVM_NONE)
        endfunction
    endclass

    class fifo_b2b_test extends fifo_test;
        `uvm_component_utils(fifo_b2b_test)

        function new(string name = "fifo_b2b_test", uvm_component parent = null);
            super.new(name, parent);
        endfunction

        function void build_phase(uvm_phase phase);
            fifo_transaction::type_id::set_inst_override(fifo_no_delay_transaction::get_type(),
                                                         "env.vsqr.vseq.wr_seq.*", this);
            super.build_phase(phase);
        endfunction
    endclass

    class fifo_passive_rd_test extends fifo_test;
        `uvm_component_utils(fifo_passive_rd_test)

        function new(string name = "fifo_passive_rd_test", uvm_component parent = null);
            super.new(name, parent);
        endfunction

        function void build_phase(uvm_phase phase);
            uvm_config_db #(uvm_bitstream_t)::set(this, "env.rd_agt", "is_active", UVM_PASSIVE);
            super.build_phase(phase);
            cfg.has_scoreboard = 1'b0;
        endfunction

        task run_phase(uvm_phase phase);
            fifo_item_seq wr_seq = fifo_item_seq::type_id::create("wr_seq");

            phase.raise_objection(this, "write-only stimulus");
            wr_seq.start(env.wr_agt.sqr);
            phase.drop_objection(this, "write-only stimulus");
        endtask
    endclass

endpackage
