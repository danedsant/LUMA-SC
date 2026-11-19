import type { Metadata } from "next";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import NextLink from "@/components/next-link";

export const metadata: Metadata = {
  title: "LUMA — Torre 4, La Churuata",
  description:
    "Sistema de gestión comunicacional, incidencias y cobranza de la Torre 4 del Conjunto Residencial La Churuata.",
};

const modules = [
  {
    icon: CampaignOutlinedIcon,
    title: "Cartelera digital",
    description:
      "Anuncios, normativas y recibos en un solo lugar, siempre actualizados.",
  },
  {
    icon: BuildOutlinedIcon,
    title: "Reporte de averías",
    description:
      "Reporta con foto y sigue el estado de cada incidencia hasta su cierre.",
  },
  {
    icon: AccountBalanceWalletOutlinedIcon,
    title: "Cobranza y gas",
    description:
      "Consulta tu recibo, registra pagos y revisa tu saldo e histórico.",
  },
  {
    icon: VerifiedUserOutlinedIcon,
    title: "Transparencia",
    description:
      "Ingresos, egresos y conciliación con el estado de cuenta del condominio.",
  },
];

export default function Home() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
      <AppBar
        position="static"
        sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 2 }}>
            <Typography variant="h6" component="p" sx={{ flexGrow: 1 }}>
              LUMA
            </Typography>
            <Button component={NextLink} href="/login" variant="outlined">
              Acceder
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      <Box
        component="section"
        sx={{
          background:
            "radial-gradient(1200px 500px at 20% 0%, #e6f2ec 0%, transparent 60%), #f6f8f6",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
          <Stack spacing={3} sx={{ maxWidth: 760 }}>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ letterSpacing: 1.5 }}
            >
              Conjunto Residencial La Churuata · Torre 4
            </Typography>
            <Typography variant="h2" component="h1" sx={{ fontSize: { xs: 38, md: 56 } }}>
              LUMA, la administración de tu torre en un solo lugar.
            </Typography>
            <Typography variant="h6" component="p" color="text.secondary" sx={{ fontWeight: 400 }}>
              Comunicación clara, averías con seguimiento y cobranza
              transparente. Diseñado para usarse desde el celular.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                component={NextLink}
                href="/login"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
              >
                Entrar a mi cuenta
              </Button>
              <Button component={NextLink} href="#modulos" variant="outlined" size="large">
                Conocer los módulos
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container component="section" id="modulos" maxWidth="lg" sx={{ py: 10 }}>
        <Stack spacing={1} sx={{ mb: 5 }}>
          <Typography variant="h3" component="h2">
            Todo lo que la torre necesita
          </Typography>
          <Typography color="text.secondary">
            Cuatro módulos pensados para la junta, los vecinos y la contadora.
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {modules.map(({ icon: Icon, title, description }) => (
            <Grid key={title} size={{ xs: 12, sm: 6 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2.5,
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      mb: 2.5,
                    }}
                  >
                    <Icon fontSize="small" />
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {title}
                  </Typography>
                  <Typography color="text.secondary">{description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box component="footer" sx={{ mt: "auto", borderTop: 1, borderColor: "divider", bgcolor: "background.paper" }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{ justifyContent: "space-between" }}
          >
            <Typography variant="body2" color="text.secondary">
              Proyecto de Servicio Comunitario UNEG · Ingeniería Informática
            </Typography>
            <Typography variant="body2" color="text.secondary">
              RIF J-31119491-6 · admn.churuatatorre4@gmail.com
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
