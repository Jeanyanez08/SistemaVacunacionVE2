const UsuarioModel = require('../models/usuarioModel');
const LogModel = require('../models/logModel');

const UsuarioController = {
  async listar(req, res) {
    try {
      const usuarios = await UsuarioModel.listarTodos();
      return res.status(200).json({ ok: true, data: usuarios });
    } catch (error) {
      console.error('Error al listar usuarios:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const usuario = await UsuarioModel.buscarPorId(id);
      if (!usuario) {
        return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
      }
      return res.status(200).json({ ok: true, data: usuario });
    } catch (error) {
      console.error('Error al buscar usuario:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async listarRoles(req, res) {
    try {
      const roles = await UsuarioModel.listarRoles();
      return res.status(200).json({ ok: true, data: roles });
    } catch (error) {
      console.error('Error al listar roles:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async login(req, res) {
    try {
      const { nombre_usuario, clave } = req.body;
      if (!nombre_usuario || !clave) {
        return res.status(400).json({
          ok: false,
          message: 'Debe indicar usuario y clave'
        });
      }

      const usuario = await UsuarioModel.buscarPorNombreUsuario(nombre_usuario);
      if (!usuario || usuario.clave !== clave) {
        return res.status(401).json({
          ok: false,
          message: 'Credenciales inválidas'
        });
      }

      const { clave: _, ...datosUsuario } = usuario;
      return res.status(200).json({
        ok: true,
        message: 'Inicio de sesión exitoso',
        data: datosUsuario
      });
    } catch (error) {
      console.error('Error en login:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async crear(req, res) {
    try {
      const { nombre_usuario, clave, id_rol, id_centros, id_usuario_actor } = req.body;
      if (!nombre_usuario || !clave || !id_rol) {
        return res.status(400).json({
          ok: false,
          message: 'nombre_usuario, clave e id_rol son obligatorios'
        });
      }

      const idNuevo = await UsuarioModel.crear({
        nombre_usuario,
        clave,
        id_rol,
        id_centros: id_centros || null
      });

      const usuarioLog = id_usuario_actor || req.usuario?.id_usuario;
      if (usuarioLog) {
        await LogModel.registrar({
          id_usuario: usuarioLog,
          accion: 'INSERT',
          tabla_afectada: 'usuario',
          descripcion_detalle: `Usuario "${nombre_usuario}" (ID ${idNuevo}) creado`
        });
      }

      return res.status(201).json({
        ok: true,
        message: 'Usuario creado correctamente',
        id_usuario: idNuevo
      });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const { nombre_usuario, id_rol, id_centros, id_usuario_actor } = req.body;

      const actualizado = await UsuarioModel.actualizar(id, {
        nombre_usuario,
        id_rol,
        id_centros: id_centros || null
      });

      if (actualizado === 0) {
        return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
      }

      const usuarioLog = id_usuario_actor || req.usuario?.id_usuario;
      if (usuarioLog) {
        await LogModel.registrar({
          id_usuario: usuarioLog,
          accion: 'UPDATE',
          tabla_afectada: 'usuario',
          descripcion_detalle: `Usuario ID ${id} actualizado`
        });
      }

      return res.status(200).json({ ok: true, message: 'Usuario actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async cambiarClave(req, res) {
    try {
      const { id } = req.params;
      const { clave } = req.body;
      if (!clave) {
        return res.status(400).json({ ok: false, message: 'La nueva clave es obligatoria' });
      }

      const actualizada = await UsuarioModel.actualizarClave(id, clave);
      if (actualizada === 0) {
        return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
      }

      return res.status(200).json({ ok: true, message: 'Clave actualizada correctamente' });
    } catch (error) {
      console.error('Error al actualizar clave:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  },

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      const eliminado = await UsuarioModel.eliminar(id);
      if (eliminado === 0) {
        return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
      }

      const usuarioLog = req.body?.id_usuario_actor || req.usuario?.id_usuario;
      if (usuarioLog) {
        await LogModel.registrar({
          id_usuario: usuarioLog,
          accion: 'DELETE',
          tabla_afectada: 'usuario',
          descripcion_detalle: `Usuario ID ${id} eliminado`
        });
      }

      return res.status(200).json({ ok: true, message: 'Usuario eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  }
};

module.exports = UsuarioController;