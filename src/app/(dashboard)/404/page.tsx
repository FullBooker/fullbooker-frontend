"use client";

import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useRouter } from "next/navigation";

const Custom404: React.FC = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="w-full h-fit flex flex-col gap-4 md:gap-5 lg:gap-7 pb-10">
      <Container
        maxWidth="md"
        style={{ textAlign: "center", marginTop: "100px" }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h3" component="h1" gutterBottom>
            404 - Page Not Found
          </Typography>

          <Typography variant="h6" component="p" gutterBottom>
            Sorry, the page you are looking for does not exist.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={handleGoHome}
            style={{ marginTop: "20px" }}
          >
            Go Back Home
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default Custom404;
