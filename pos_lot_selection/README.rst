

=================
SIKI POS Lot Selection
=================


List of modifications / Updates:
--------------------------------
    * V.-2.0 Permite seleccionar primero el Producto, segundo paso selección de Lote
    * V.-2.1 Al precionar botón de pago, si en la línea de orden existe un producto de lote o serie, no permite procesar factura hasta tanto el usuario seleccione un lote o serail correspondiente
    * V.-2.2 Ventana de alerta si no haz seleccionado un Lote
    * V.-2.3 En input lista destinado para selecionar lotes, aparece la cantidad de productos en Stock para el Lote en específico
    * V.-2.4 Presentación más amigable en lista de lotes, Nombre de lote y cantidad en Unidades que tiene en Stock
    * V.-2.5 Correción de Error en la Lista de producto tipo serial, no mostraba la lista si la cantidad en la linea de orden era mayor a uno
    * V.-3.0 Funcianabilidad de la aplicacion para operar en POS en estado sin conexión a Internet
    * V.-3.1 Actualizacion de cantidades vendidas y disponibles de lotes / serial en BD Cache
    * V.-3.2 Capacidad dual de trabajar la inaformación con backend y cache, acción a ejecutar al abrir ventana de selección de lotes
    * V.-3.3 Dependecias necesarias de codigo python y clases javascript para trabajar con la APP siki_pos_lot
    * V.-4.0 Se incorpora a la lista de Lotes, información sobre los Dias que quedan para caducar el Lote
    * V.-4.1 Organización de la lista de lotes por fecha de eliminación de acuerdo a métodos de gestión de almacén FEFO
    * V.-4.2 Se corrige error, al llegar cantidad del lote a 1 no asignaba correctamente el nombre de Lote
    * V.-4.3 Se corrige error, no se abre popup lotes si el POS se encuentra sin conexión
