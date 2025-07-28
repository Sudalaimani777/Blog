import React from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, CardActions, Button, Container } from '@mui/material';

const animeList = [
  {
    title: 'Kimetsu no Yaiba: Hashira Geiko-hen',
    image: 'https://wallpapers.com/images/featured/demon-slayer-pictures-tsbyd3y88kxirm15.webp',
    summary: 'After a series of mighty clashes with Upper Rank Demons, Tanjirou Kamado recovers and trains with the Hashira for the final battle against Muzan Kibutsuji.',
    link: 'https://myanimelist.net/anime/55701/Kimetsu_no_Yaiba__Hashira_Geiko-hen',
  },
  {
    title: 'Kaijuu 8-gou',
    image: 'https://4kwallpapers.com/images/walls/thumbs/21963.jpg',
    summary: 'Kafka Hibino, able to transform into a humanoid kaijuu, joins the Defense Force to protect Japan from colossal monsters.',
    link: 'https://myanimelist.net/anime/52588/Kaijuu_8-gou',
  },
  {
    title: 'Mushoku Tensei II: Isekai Ittara Honki Dasu Part 2',
    image: 'https://4kwallpapers.com/images/walls/thumbs/22933.jpg',
    summary: 'Rudeus Greyrat, after reuniting with Sylphiette and facing new challenges, must apply lessons learned in a new world to live life to the fullest.',
    link: 'https://myanimelist.net/anime/55888/Mushoku_Tensei_II__Isekai_Ittara_Honki_Dasu_Part_2',
  },
  {
    title: 'Kono Subarashii Sekai ni Shukufuku wo! 3',
    image: 'https://cdn.oneesports.gg/cdn-data/2022/06/Anime_KonoSuba-1024x576.jpg',
    summary: 'Kazuma and his party return home, facing new adventures, debts, and an invitation from a princess that leads to more comedic chaos.',
    link: 'https://myanimelist.net/anime/49458/Kono_Subarashii_Sekai_ni_Shukufuku_wo_3',
  },
  {
    title: 'Tensei shitara Slime Datta Ken 3rd Season',
    image: 'https://cdn.oneesports.gg/cdn-data/2025/06/HonkaiStarRail_Phainon_3_4_KV-768x432.jpg',
    summary: 'Rimuru Tempest’s victory brings peace and growth, but new threats and conspiracies loom for the nation of Tempest.',
    link: 'https://myanimelist.net/anime/53580/Tensei_shitara_Slime_Datta_Ken_3rd_Season',
  },
  {
    title: 'Wind Breaker',
    image: 'https://cdn.oneesports.gg/cdn-data/2024/06/Anime_WindBreaker_Bofurin_Season1Finale_Keyart_1-768x432.jpg',
    summary: 'Haruka Sakura, a fighter and outcast, finds acceptance and camaraderie at Furin High, fighting to protect the town.',
    link: 'https://myanimelist.net/anime/54900/Wind_Breaker',
  },
];

const Home = () => {
  return (
    <Container maxWidth="lg" sx={{ 
      py: { xs: 3, sm: 4, md: 6 }, 
      px: { xs: 2, sm: 3, md: 4 },
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center' 
    }}>
      <Typography 
        variant="h3" 
        align="center" 
        gutterBottom 
        sx={{ 
          mb: { xs: 3, sm: 4 },
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          fontWeight: 'bold',
          lineHeight: 1.2
        }}
      >
        Spring 2024 Top Anime
      </Typography>
      <Grid 
        container 
        spacing={{ xs: 2, sm: 3, md: 4 }} 
        justifyContent="center"
        sx={{ width: '100%' }}
      >
        {animeList.map((anime, idx) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            lg={4} 
            key={idx}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              maxWidth: { xs: '100%', sm: 'calc(50% - 16px)', lg: 'calc(33.333% - 22px)' },
              minWidth: { xs: '100%', sm: '300px' }
            }}
          >
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                width: '100%',
                maxWidth: '400px',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  height: { xs: 200, sm: 250, md: 300 },
                  objectFit: 'cover',
                  width: '100%'
                }}
                image={anime.image}
                alt={anime.title}
              />
              <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                <Typography 
                  gutterBottom 
                  variant="h5" 
                  component="h2"
                  sx={{
                    fontSize: { xs: '1.25rem', sm: '1.4rem' },
                    fontWeight: 600,
                    mb: 2
                  }}
                >
                  {anime.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                    lineHeight: 1.6,
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {anime.summary}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
                <Button 
                  size="medium" 
                  color="primary" 
                  variant="contained"
                  fullWidth
                  href={anime.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{
                    py: 1,
                    fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: 1
                  }}
                >
                  Learn More
                </Button>
              </CardActions>
            </Card>
            
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Home