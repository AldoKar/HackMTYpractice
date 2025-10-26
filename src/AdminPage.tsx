import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Settings, 
  Smartphone, 
  Save, 
  RotateCcw, 
  Wifi,
  Bell,
  Shield,
  Battery,
  Signal,
  Clock,
  MapPin,
  ChevronRight
} from "lucide-react";

const AdminPage = () => {
  // Device configuration state
  const [deviceName, setDeviceName] = useState("");
  const [originalDeviceName, setOriginalDeviceName] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load saved configuration
  useEffect(() => {
    const savedName = localStorage.getItem("paysafeDeviceName") || "Mi Pay$afe";
    const savedNotifications = localStorage.getItem("paysafeNotifications") !== "false";
    const savedAutoSync = localStorage.getItem("paysafeAutoSync") !== "false";
    
    setDeviceName(savedName);
    setOriginalDeviceName(savedName);
    setNotificationsEnabled(savedNotifications);
    setAutoSyncEnabled(savedAutoSync);
  }, []);

  // Check for unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(deviceName !== originalDeviceName);
  }, [deviceName, originalDeviceName]);

  // Save configuration
  const handleSave = () => {
    if (!deviceName.trim()) {
      toast.error("El nombre del dispositivo no puede estar vacío");
      return;
    }

    localStorage.setItem("paysafeDeviceName", deviceName);
    localStorage.setItem("paysafeNotifications", String(notificationsEnabled));
    localStorage.setItem("paysafeAutoSync", String(autoSyncEnabled));
    
    setOriginalDeviceName(deviceName);
    toast.success("Configuración guardada exitosamente");
  };

  // Reset to default
  const handleReset = () => {
    const defaultName = "Mi Pay$afe";
    setDeviceName(defaultName);
    setNotificationsEnabled(true);
    setAutoSyncEnabled(true);
    
    localStorage.setItem("paysafeDeviceName", defaultName);
    localStorage.setItem("paysafeNotifications", "true");
    localStorage.setItem("paysafeAutoSync", "true");
    
    setOriginalDeviceName(defaultName);
    toast.success("Configuración restaurada a valores predeterminados");
  };

  // Toggle notifications
  const toggleNotifications = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    localStorage.setItem("paysafeNotifications", String(newValue));
    toast.success(newValue ? "Notificaciones activadas" : "Notificaciones desactivadas");
  };

  // Toggle auto sync
  const toggleAutoSync = () => {
    const newValue = !autoSyncEnabled;
    setAutoSyncEnabled(newValue);
    localStorage.setItem("paysafeAutoSync", String(newValue));
    toast.success(newValue ? "Sincronización automática activada" : "Sincronización automática desactivada");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Badge variant="outline" className="border-red-600 text-red-600 px-4 py-1.5 text-sm font-medium">
              <Settings className="w-3.5 h-3.5 mr-1.5" />
              Administración
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Configuración de
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-red-600 to-red-400 mt-2">
              Dispositivo Pay$afe
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl leading-relaxed">
            Personaliza y administra tu dispositivo Pay$afe. Cambia el nombre, 
            ajusta configuraciones y mantén tu dispositivo actualizado.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Configuration Card */}
            <Card className="md:col-span-2 bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-red-600" />
                  Información del Dispositivo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Device Name Input */}
                <div className="space-y-2">
                  <Label htmlFor="deviceName" className="text-gray-200 font-medium">
                    Nombre del Dispositivo
                  </Label>
                  <Input
                    id="deviceName"
                    type="text"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    placeholder="Ej: Pay$afe Principal"
                    className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-500"
                    maxLength={30}
                  />
                  <p className="text-sm text-gray-400">
                    {deviceName.length}/30 caracteres
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleSave}
                    disabled={!hasUnsavedChanges}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </Button>
                  <Button 
                    onClick={handleReset}
                    variant="outline"
                    className="border-gray-600 text-black hover:bg-gray-300"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Restaurar
                  </Button>
                </div>

                {hasUnsavedChanges && (
                  <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                    <p className="text-yellow-400 text-sm font-medium">
                      Tienes cambios sin guardar
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Device Status Card */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Signal className="w-5 h-5 text-green-500" />
                  Estado del Dispositivo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Conexión</span>
                  <Badge className="bg-green-600">
                    <Wifi className="w-3 h-3 mr-1" />
                    Conectado
                  </Badge>
                </div>
                
                

                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Última Sync</span>
                  <span className="text-gray-400 text-sm flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Hace 2 min
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Grid */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {/* Notifications Setting */}
            <Card 
              className="bg-gray-800 border-gray-700 hover:border-red-600 transition-all cursor-pointer group"
              onClick={toggleNotifications}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-600 rounded-lg">
                      <Bell className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1 group-hover:text-red-400 transition-colors">
                        Notificaciones
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {notificationsEnabled 
                          ? "Recibe alertas en tiempo real sobre eventos del dispositivo"
                          : "Las notificaciones están desactivadas"
                        }
                      </p>
                    </div>
                  </div>
                  <Badge variant={notificationsEnabled ? "default" : "outline"} 
                         className={notificationsEnabled ? "bg-green-600" : "border-gray-600"}>
                    {notificationsEnabled ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Auto Sync Setting */}
            <Card 
              className="bg-gray-800 border-gray-700 hover:border-red-600 transition-all cursor-pointer group"
              onClick={toggleAutoSync}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-600 rounded-lg">
                      <RotateCcw className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1 group-hover:text-red-400 transition-colors">
                        Sincronización Automática
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {autoSyncEnabled 
                          ? "Los datos se sincronizan automáticamente cada 5 minutos"
                          : "La sincronización automática está desactivada"
                        }
                      </p>
                    </div>
                  </div>
                  <Badge variant={autoSyncEnabled ? "default" : "outline"} 
                         className={autoSyncEnabled ? "bg-green-600" : "border-gray-600"}>
                    {autoSyncEnabled ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Security Info Card */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-600 rounded-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">
                      Seguridad
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">
                      Tu dispositivo está protegido con encriptación de extremo a extremo
                    </p>
                    <Badge className="bg-green-600">
                      Verificado
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Services Card */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-600 rounded-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">
                      Servicios de Ubicación
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">
                      El GPS está activo para tracking en tiempo real
                    </p>
                    <Badge className="bg-green-600">
                      GPS Activo
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          
        </div>
      </section>

      
    </div>
  );
};

export default AdminPage;
