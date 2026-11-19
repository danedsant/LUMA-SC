import type { Metadata } from "next";
import LogoutIcon from "@mui/icons-material/Logout";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { redirect } from "next/navigation";

import { ROLE_LABELS } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

import { logout } from "../login/actions";

export const metadata: Metadata = {
  title: "Panel | LUMA",
};

export const dynamic = "force-dynamic";

export default async function PanelPage() {
  if (!isSupabaseConfigured) {
    redirect("/login");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("rol, apto_id, activo")
    .eq("auth_uid", user.id)
    .maybeSingle();

  let apto: { codigo: string } | null = null;
  if (perfil?.apto_id) {
    const { data } = await supabase
      .from("aptos")
      .select("codigo")
      .eq("id", perfil.apto_id)
      .maybeSingle();
    apto = data;
  }

  const rolLabel = perfil?.rol ? (ROLE_LABELS[perfil.rol] ?? perfil.rol) : "Sin perfil";

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "background.default" }}>
      <AppBar position="static" sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 2 }}>
            <Typography variant="h6" component="p" sx={{ flexGrow: 1 }}>
              LUMA
            </Typography>
            <Chip
              size="small"
              label={rolLabel}
              color={perfil?.activo ? "primary" : "default"}
              variant="outlined"
            />
            <form action={logout}>
              <Button type="submit" variant="outlined" size="small" startIcon={<LogoutIcon />}>
                Salir
              </Button>
            </form>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack direction="row" spacing={2.5} sx={{ alignItems: "center", mb: 4 }}>
          <Avatar sx={{ bgcolor: "primary.main", width: 52, height: 52 }}>
            {apto?.codigo?.replace(/\D/g, "").slice(0, 2) ?? "LU"}
          </Avatar>
          <Box>
            <Typography variant="overline" color="text.secondary">
              Panel del vecino
            </Typography>
            <Typography variant="h4" component="h1">
              {apto ? `Apartamento ${apto.codigo}` : "Hola de nuevo"}
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  Mi cuenta
                </Typography>
                <Stack spacing={1.25} sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <Box component="span" sx={{ color: "text.secondary" }}>
                      Rol:{" "}
                    </Box>
                    {rolLabel}
                  </Typography>
                  <Typography variant="body2">
                    <Box component="span" sx={{ color: "text.secondary" }}>
                      Apartamento:{" "}
                    </Box>
                    {apto?.codigo ?? "No asignado"}
                  </Typography>
                  <Typography variant="body2">
                    <Box component="span" sx={{ color: "text.secondary" }}>
                      Estado:{" "}
                    </Box>
                    {perfil?.activo ? "Activo" : "Inactivo"}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="h6" component="h2">
                    Cartelera
                  </Typography>
                  <Chip size="small" label="Fase 5" />
                </Stack>
                <Typography color="text.secondary" sx={{ mt: 2 }}>
                  Anuncios, normativas y comunicados de la junta.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="h6" component="h2">
                    Estado de cuenta
                  </Typography>
                  <Chip size="small" label="Fase 5" />
                </Stack>
                <Typography color="text.secondary" sx={{ mt: 2 }}>
                  Recibos, pagos, gas y saldo pendiente.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
