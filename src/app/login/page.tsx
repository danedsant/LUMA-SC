import type { Metadata } from "next";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import NextLink from "@/components/next-link";
import { isSupabaseConfigured } from "@/lib/env";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Acceso | LUMA",
};

export default function LoginPage() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        bgcolor: "background.default",
        px: 2,
        py: 6,
      }}
    >
      <Container maxWidth="xs" disableGutters>
        <Card>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack spacing={3}>
              <Stack spacing={0.75}>
                <Typography variant="overline" color="primary.main" sx={{ letterSpacing: 1.5 }}>
                  LUMA · Torre 4
                </Typography>
                <Typography variant="h5" component="h1">
                  Acceso a tu cuenta
                </Typography>
                <Typography color="text.secondary">
                  Entra con tu cédula y contraseña. La junta te entrega las
                  credenciales.
                </Typography>
              </Stack>

              {isSupabaseConfigured ? (
                <LoginForm />
              ) : (
                <Alert severity="info">
                  Supabase aún no está configurado. Copia{" "}
                  <code>.env.example</code> a <code>.env.local</code> y completa
                  las claves.
                </Alert>
              )}

              <Button
                component={NextLink}
                href="/"
                variant="text"
                startIcon={<ArrowBackIcon />}
                sx={{ alignSelf: "flex-start" }}
              >
                Volver al inicio
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
