/* Copyright 2018 Tecnativa - David Vidal
   License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl). */

odoo.define("pos_lot_selection.models", function (require) {
    "use strict";
    //console.log('exito en models con var siki pos lot')
    var models = require("point_of_sale.models");

    //Necesario para trabajar con SIKI POS LOT
    var siki_pos_lot = require("siki_pos_lot.pos");

    var Model = require("web.DataModel");
    var session = require("web.session");
    var PosBaseWidget = require('point_of_sale.BaseWidget');

    var _posmodel_super = models.PosModel.prototype;

    models.PosModel = models.PosModel.extend({


        initialize: function(session, attributes) {
               _posmodel_super.initialize.apply(this, arguments);
               this.stock_quant = [];
               this.state_connection = '';

               var model_stock_quant = {
                    model:  'stock.quant',
                    fields: ['product_id','lot_id', 'qty','location_id','in_date','removal_date'],
                    domain: [["lot_id", "!=", false]],
                    loaded: function(self, stock_quant){
                        self.stock_quant = stock_quant;
                    }
                };
                _posmodel_super.models.push(model_stock_quant);

          },

        update_model: function(line){
            var self = this;
            var product = line.get_product().id;
            var model_stock_quant  = self.stock_quant
            var location_id = self.config.stock_location_id[0];

            var filter_models =  model_stock_quant.filter(function(filter) {
                        return (filter.product_id[0] == product) && (filter.location_id[0] == location_id);
                    });

            if (line){

                var product = line.get_product();

                if(line.has_product_lot){

                    if(line.product.tracking === "serial"){

                        line.pack_lot_lines.each(function(product_serial){

                            // stock_quant lot_name
                            var lot_name = product_serial.attributes.lot_name;

                             //product.qty_available -= line.get_quantity();

                             var filter_product =  filter_models.filter(function(filter) {
                                    return (filter.lot_id[1] == lot_name);
                               });

                             filter_product[0].qty -= filter_product[0].qty;


                        });

                    }else{

                        line.pack_lot_lines.each(function(product_lot){
                            var lot_name = product_lot.attributes.lot_name;
                            var cantidad = product_lot.order_line.quantity;

                            var filter_product =  filter_models.filter(function(filter) {
                                    return (filter.lot_id[1] == lot_name);
                               });

                            filter_product[0].qty -= cantidad;

                        });

                    }

                }

            }

        },

        push_order: function(order){
            var self = this;
            var pushed = _posmodel_super.push_order.call(this, order);


            if (order){

                order.orderlines.each(function(line){

                    self.update_model(line)

                })
            }
            return pushed;
        },

        doesConnectionExist: function () {
            var xhr = new XMLHttpRequest();
            var protocol = window.location.protocol;
            var url = window.location.host;

            //console.log('Hola soy la URL que verifica si hay conexion ->',protocol+url)


            var file = protocol+'//'+url;
             var r = Math.round(Math.random() * 10000);
             xhr.open('HEAD', file + "?subins=" + r, false);
             try {
              xhr.send();
              if (xhr.status >= 200 && xhr.status < 304) {
               return true;
              } else {
               return false;
              }
             } catch (e) {
              return false;
             }


        },

        get_lot: function(product, location_id, stock_quant, type_lot) {
            var done = new $.Deferred();
            var self = this;
                //console.log('self connection', self.doesConnectionExist());

            var model_stock_quant  = self.stock_quant

                if(self.doesConnectionExist()){
                    session.rpc("/web/dataset/search_read", {
                        "model": "stock.quant",
                        "domain": [
                            ["location_id", "=", location_id],
                            ["product_id", "=", product]],
                    }, {'async': false}).then(function (result) {

                       // console.log('Pido informacion al Backen sobre los Lotes ->',result)
                        var product_lot = [];
                       // console.log('Si tengo resultados entro aca result.length ->',result.length)
                        if (result.length) {

                            for (var i = 0; i < result.length; i++) {

                                //console.log('Line 193 models.js result', result.records[i])

                                if(type_lot == 'lot'){

                                    var filter_models =  model_stock_quant.filter(function(filter) {

                                        return (filter.product_id[0] == product) && (filter.lot_id[0] == result.records[i].lot_id[0]);
                                    });

                                    filter_models[0].qty = result.records[i].qty;
                                   // console.log('Actualizado cache de Lotes lot_id/product_id/qty', result.records[i].lot_id[1]+'->'+product+'->'+result.records[i].qty)
                                }
                         //   console.log('Conexion al Server')

                                product_lot.push({
                                    'lot_name': result.records[i].lot_id[1],
                                    'qty': result.records[i].qty,
                                    'in_date': result.records[i].in_date,
                                    'removal_date': result.records[i].removal_date,
                                });
                            }
                        }
                        done.resolve(product_lot);
                    });

                }else{
                    //console.log('Aqui estamos por Cache stock_quant.length ->',stock_quant.length)
                    var product_lot = [];

                     if (stock_quant.length) {


                        var filter_models =  stock_quant.filter(function(filter) {
                            return (filter.product_id[0] == product) && (filter.location_id[0] == location_id);
                        });

                        for (var i = 0; i < filter_models.length; i++) {

                            //console.log('Sin Conexion al Server')
                            //console.log('Line 193 models.js result', filter_models[i])

                            product_lot.push({
                                    'lot_name': filter_models[i].lot_id[1],
                                    'qty': filter_models[i].qty,
                                    'in_date': filter_models[i].in_date,
                                    'removal_date': filter_models[i].removal_date,
                                });
                        }
                    }
                    done.resolve(product_lot);

                }

            return done;
        }

    });

    var _orderline_super = models.Orderline.prototype;
    models.Orderline = models.Orderline.extend({
        compute_lot_lines: function(){
            var done = new $.Deferred();
            var compute_lot_lines = _orderline_super.compute_lot_lines.apply(this, arguments);
            var type_lot = compute_lot_lines.order_line.product.tracking;

            this.pos.get_lot(this.product.id, this.pos.config.stock_location_id[0], this.pos.stock_quant, type_lot)
            .then(function (product_lot) {
                var lot_name = [];
                var lot_qty = [];
                var lot_expire = [];
                var lot_in_date = [];
                var lot_removal_date = [];
                var valueToPush = [];
                var current_date = new Date();
                var format_fecha;
                var formatted_date_removal;

                var formatted_current_date = current_date.getDate() +
                                "-" + (current_date.getMonth() + 1) +
                                "-" + current_date.getFullYear()


                var type_lot = compute_lot_lines.order_line.product.tracking;
               // console.log('product_lot', product_lot)
                //https://koukia.ca/sorting-an-array-of-objects-with-jquery-d01e12047ce4
                function sortByKeyAsc(array, key) {
                    return array.sort(function (a, b) {
                        var x = a[key]; var y = b[key];
                        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                    });
                }
                var product_lot = sortByKeyAsc(product_lot, "removal_date");
               // console.log('product_lot ordenado',product_lot)

                for (var i = 0; i < product_lot.length; i++) {



                    if(type_lot == 'serial'){
                       //Lista de producto serial disponibles
                        if (product_lot[i].qty != 0) {
                            lot_name.push(product_lot[i].lot_name);
                            lot_qty.push(product_lot[i].qty);
                            lot_expire.push("*");

                        }
                    }else{

                         if (product_lot[i].qty >= compute_lot_lines.order_line.quantity) {

                            format_fecha = new Date(product_lot[i].removal_date);

                            formatted_date_removal = format_fecha.getDate() +
                                "-" + (format_fecha.getMonth() + 1) +
                                "-" + format_fecha.getFullYear()

                            var formato_info_vencimiento = 'Lote vence en: ' + Math.floor((format_fecha - current_date)/(1000*60*60*24)) + ' días';


                            lot_name.push(product_lot[i].lot_name);
                            lot_qty.push(product_lot[i].qty);
                            lot_expire.push(formato_info_vencimiento);
                        }
                    }

                }

                compute_lot_lines.lot_name = lot_name;
                compute_lot_lines.lot_qty = lot_qty;
                compute_lot_lines.lot_expire = lot_expire;


                done.resolve(compute_lot_lines);
            });
            return compute_lot_lines;
        },
    });

});
