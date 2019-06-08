# -*- coding: utf-8 -*-

from openerp import models, fields, api


class PosSelectionStckoPiking(models.Model):
    _inherit='stock.quant'

    #Realacion una a muchos obtenidad stock.production.lot, par obtener fecha de vencimiento , fecha de creacion

    stock_production_lot_id = fields.Many2one('stock.production.lot', 'stock_quank')

    use_date = fields.Datetime(related='stock_production_lot_id.use_date')
    life_date = fields.Datetime(related='stock_production_lot_id.life_date')
    creata_date = fields.Datetime(related='stock_production_lot_id.create_date', string="Fecha de Incorporacion")
