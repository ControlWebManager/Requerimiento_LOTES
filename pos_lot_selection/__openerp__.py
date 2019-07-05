# -*- coding: utf-8 -*-
# Copyright 2018 Tecnativa S.L. - David Vidal
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

{
    'name': 'SIKI POS Lot Selection',
    'version': '10.0.1.0.0',
    'category': 'Point of Sale',
    'author': 'Tecnativa,'
              'Odoo Community Association (OCA) && Update Ing Henry Vivas',
    'website': 'https://github.com/OCA/pos',
    'license': 'AGPL-3',
    'depends': [
        'siki_pos_lot',
        'point_of_sale',

    ],
    'data': [
        'templates/assets.xml',
    ],
    'qweb': [
        'static/src/xml/pos.xml'
    ],
    'application': False,
    'installable': True,
}
