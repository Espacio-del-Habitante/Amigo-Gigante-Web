import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import { Box, Button, Card, CardContent, Container, Stack, Typography } from "@mui/material";

const storeItems = [
  {
    title: "Collares Artesanales",
    price: "$25.000",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAJCRUJJFKLQu9oz9-llyi_l6_3BoqdXrVFOy527zpoHHxh5ZOAYr5_MZNpNYZHHBDKcSJO4RD2C3lydf-2hH_QXXmXIDPwNqgkFxOpnLtxGRQkSQQGx826qUCm3k-x0yx09l-eHXNiRuxff2MscieQkzKoOuxiJrAi_fbOD_b7qabhL6otjlh7iwoznjxfG4s-Y8r7x0sFUKLV8PJYu2wTFrhTus_2R-ZCKOPwXQzEQsYuLsXKWnXNKTGhPZBSLhijLF0Ed0UKHQ",
  },
  {
    title: "Camas Acolchadas",
    price: "$85.000",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBeKk6P-KLrvGRTKXNS0Ypihrfw51dgYflLU6FUgSXgwt920mqBf7mlxnv-CA2RZI80RBFreuvRZRFfSMk7aw4g6eFJaSjCToaPwkER6ayS9PcjwXXqazUOVN3uRqzQaBdlelFBonwVrzcCoU_OZM7tDxuMdEpkFzqxGEDNlBfJcLD3siK_gk1W4hH7nRZVniAuYpNr90_l9MqXEeENdhC_GmXIWzoKGEBFfML6ddHdYZB46S5m_SgdxjKSUvv92cvpJ1su1075RA",
  },
  {
    title: "Juguetes Eco",
    price: "$15.000",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBB0ok7Bx9Y15pPGX5YSknishg3lvRslXwd8a_hb7nXRRrBwOc5F-LR03MODQKtHnhMtuXZT3LxV363dTxnEimVwQBOiW5i0KIUKgmm-5adhoDte7L6RgcnsTNDUQsfZpIewNxRBJGfXicTFxRMd8s7YKq5Ar9AVigWlGk0PF4gu29YwFg4a7riAX9DV0Gv2BdiFX86pUwdJdWWjSlSxSQAtJ0hj-6PDgdeXEbRGcuAsZTuQtvl021qX5Y5xrT9BPKCcdsDgG_18w",
  },
];

export function StoreSection() {
  return (
    <Box component="section" className="bg-[#f7fbff] py-16 md:py-20">
      <Container maxWidth="lg">
        <Box className="grid items-center gap-8 md:gap-10 lg:grid-cols-12">
          <Box className="order-2 lg:order-1 lg:col-span-5">
            <Stack className="mb-2 gap-1">
              <Typography variant="subtitle2" sx={{ color: "secondary.main", fontWeight: 800, letterSpacing: 1 }}>
                Tienda Solidaria
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a" }}>
                Compra con Propósito
              </Typography>
            </Stack>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              Cada producto que compras en nuestra tienda financia alimentos, vacunas y tratamientos médicos para los
              animales que aún esperan un hogar.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} className="mt-6 gap-3">
              <Button
                variant="contained"
                startIcon={<StorefrontRoundedIcon />}
                sx={{
                  backgroundColor: "secondary.main",
                  color: "#fff",
                  fontWeight: 800,
                  px: 3.5,
                  py: 1.4,
                  borderRadius: 2.5,
                  ":hover": { backgroundColor: "#ea580c" },
                }}
              >
                Visitar Tienda
              </Button>
            </Stack>
          </Box>
          <Box className="order-1 grid gap-4 sm:grid-cols-2 lg:order-2 lg:col-span-7">
            {storeItems.map((item) => (
              <Card
                key={item.title}
                sx={{
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: "0 12px 30px rgba(15,23,42,0.06)",
                  overflow: "hidden",
                }}
              >
                <Box
                  component="img"
                  src={item.imageUrl}
                  alt={item.title}
                  sx={{ height: 160, width: "100%", objectFit: "cover", borderRadius: 0 }}
                />
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="primary.main" sx={{ fontWeight: 800, mt: 0.5 }}>
                    {item.price}
                  </Typography>
                </CardContent>
              </Card>
            ))}
            <Card
              sx={{
                borderRadius: 2,
                backgroundColor: "secondary.main",
                color: "#fff",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                boxShadow: "0 20px 40px rgba(249,115,22,0.3)",
              }}
            >
              <CardContent>
                <ShoppingBagRoundedIcon sx={{ fontSize: 40 }} />
                <Typography variant="h6" sx={{ fontWeight: 800, mt: 1 }}>
                  100% Solidario
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                  Todas las ganancias van a las fundaciones.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
