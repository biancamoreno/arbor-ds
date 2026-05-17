import { Box, Flex, Container, Text, Icon, Circle, Square, Image } from '../../../components/core';
import { Button } from '../../../components/button';
import { Card } from '../../../components/card';
import { Tag } from '../../../components/tag';
import { Chip } from '../../../components/chip';
import { Avatar } from '../../../components/avatar';
import { hero, features, testimonials, products } from '../_shared/fixtures';

/**
 * @platform shared
 *
 * Demo vitrine — Hero/landing. Stress-test do default visual da RFC-0041 nos
 * eixos de personalidade e hierarquia tipográfica. Sem `extendTheme()`,
 * sem cor literal. Único `style={{}}` é `textDecoration: line-through`
 * (CSS não coberto pelo sistema — escape hatch legítimo).
 *
 * Cross-platform por construção: zero `<div>`/`<span>`, imagens via `<Image>`
 * do DS, Avatar como compound, decoração geométrica via `Circle`/`Square`.
 */
export function LandingHero() {
  return (
    <Box backgroundColor="background.default" minHeight="100vh">
      <TopBar />
      <Hero />
      <SocialStrip />
      <FeaturesGrid />
      <TestimonialsRow />
      <FinalCta />
      <Footer />
    </Box>
  );
}

function TopBar() {
  return (
    <Box
      as="header"
      borderBottomWidth="hairline"
      borderBottomStyle="solid"
      borderBottomColor="border.subtle"
      backgroundColor="surface.translucent"
      position="sticky"
      top="0"
      zIndex={10}
    >
      <Container>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          paddingY="tiny"
          gap="medium"
        >
          <Flex alignItems="center" gap="micro">
            <Circle size="32px" backgroundColor="brand.solid">
              <Icon name="Sparkles" size="small" color="text.inverse" decorative />
            </Circle>
            <Text fontSize="medium" fontWeight="semibold" color="text.primary">
              arbor
            </Text>
          </Flex>

          <Flex alignItems="center" gap="medium" display={{ base: 'none', md: 'flex' }}>
            <Text as="a" fontSize="sm" fontWeight="medium" color="text.secondary" cursor="pointer">
              Componentes
            </Text>
            <Text as="a" fontSize="sm" fontWeight="medium" color="text.secondary" cursor="pointer">
              Tematização
            </Text>
            <Text as="a" fontSize="sm" fontWeight="medium" color="text.secondary" cursor="pointer">
              Documentação
            </Text>
          </Flex>

          <Flex alignItems="center" gap="micro">
            <Button variant="ghost" size="small">Entrar</Button>
            <Button variant="primary" size="small">Começar</Button>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}

function Hero() {
  return (
    <Box position="relative" overflow="hidden" backgroundColor="background.subtle">
      <HeroDecorations />
      <Container>
        <Flex
          flexDirection={{ base: 'column', md: 'row' }}
          alignItems="center"
          gap={{ base: 'large', md: 'giant' }}
          paddingY={{ base: 'huge', md: 'giant' }}
          position="relative"
          zIndex={1}
        >
          <Flex flexDirection="column" gap="small" flex="1" maxWidth="640px">
            <Box>
              <Tag tone="info">{hero.badge}</Tag>
            </Box>
            <Text
              as="h1"
              fontSize={{ base: 'displayMedium', md: 'displayLarge' }}
              fontWeight="bold"
              color="text.primary"
              letterSpacing="tightest"
              lineHeight={{ base: 'displayMedium', md: 'displayLarge' }}
            >
              {hero.title}
            </Text>
            <Text fontSize="md" color="text.secondary" lineHeight="small">
              {hero.subtitle}
            </Text>
            <Flex gap="small" flexWrap="wrap" marginTop="micro">
              <Button variant="primary" size="large">
                {hero.primaryCta}
              </Button>
              <Button variant="ghost" size="large">
                {hero.secondaryCta}
              </Button>
            </Flex>
            <Flex alignItems="center" gap="micro" marginTop="micro">
              <Icon name="CircleCheck" size="small" color="brand.solid" decorative />
              <Text fontSize="xs" color="text.tertiary">
                {hero.socialProof}
              </Text>
            </Flex>
          </Flex>

          <HeroPreview />
        </Flex>
      </Container>
    </Box>
  );
}

function HeroDecorations() {
  return (
    <>
      <Circle
        position="absolute"
        size="480px"
        top="-120px"
        right="-120px"
        backgroundColor="brand.bgSubtle"
        opacity={0.6}
      />
      <Circle
        position="absolute"
        size="280px"
        bottom="-80px"
        left="-60px"
        backgroundColor="brand.bgElement"
        opacity={0.4}
      />
      <Square
        position="absolute"
        size="120px"
        top="40%"
        right="30%"
        borderRadius="medium"
        backgroundColor="brand.bgElement"
        opacity={0.25}
        transform="rotate(12deg)"
      />
    </>
  );
}

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  const filled = Math.round(rating);
  return (
    <Flex alignItems="center" gap="nano">
      <Flex alignItems="center" gap="nano">
        {Array.from({ length: 5 }).map((_, i) => (
          <Icon
            key={i}
            name="Star"
            size="small"
            color={i < filled ? 'feedback.warning.solid' : 'border.subtle'}
            decorative
          />
        ))}
      </Flex>
      <Text fontSize="sm" fontWeight="semibold" color="text.primary" marginLeft="nano">
        {rating.toFixed(1)}
      </Text>
      <Text fontSize="sm" color="text.tertiary">
        ({reviews.toLocaleString('pt-BR')})
      </Text>
    </Flex>
  );
}

function HeroPreview() {
  const featured = products[0];
  return (
    <Flex
      flexDirection="column"
      gap="small"
      flex="1"
      maxWidth="440px"
      width="100%"
    >
      <Card variant="elevated" padding="medium">
        <Card.Media>
          <Image
            source={featured.imageUrl}
            alt={featured.imageAlt}
            width="100%"
            height={240}
            resizeMode="cover"
          />
        </Card.Media>
        <Card.Body>
          <Flex flexDirection="column" gap="micro">
            <Flex alignItems="center" justifyContent="space-between">
              <Text fontSize="xs" fontWeight="semibold" color="text.tertiary" letterSpacing="wide">
                {featured.category.toUpperCase()}
              </Text>
              <Tag tone="critical">−21%</Tag>
            </Flex>
            <Text fontSize="md" fontWeight="semibold" color="text.primary" lineHeight="medium">
              {featured.title}
            </Text>
            <Flex alignItems="baseline" gap="micro">
              <Text fontSize="lg" fontWeight="bold" color="text.primary" lineHeight="large">
                {featured.price}
              </Text>
              {featured.originalPrice && (
                <Text
                  fontSize="sm"
                  color="text.tertiary"
                  style={{ textDecoration: 'line-through' }}
                >
                  {featured.originalPrice}
                </Text>
              )}
            </Flex>
            <StarRating rating={featured.rating} reviews={featured.reviews} />
          </Flex>
        </Card.Body>
      </Card>

      <Flex gap="micro" flexWrap="wrap">
        <Chip selectable defaultSelected size="small" tone="success">
          Em estoque
        </Chip>
        <Chip selectable size="small">
          Frete grátis
        </Chip>
        <Chip selectable size="small">
          Promoção
        </Chip>
      </Flex>

      <Card variant="outlined" padding="medium">
        <Card.Body>
          <Flex alignItems="center" gap="small">
            <Avatar size="small">
              <Avatar.Fallback>MC</Avatar.Fallback>
            </Avatar>
            <Flex flexDirection="column" flex="1">
              <Text fontSize="sm" fontWeight="semibold" color="text.primary">
                Mariana acabou de comprar
              </Text>
              <Text fontSize="xs" color="text.tertiary">
                há 2 minutos · São Paulo, SP
              </Text>
            </Flex>
            <Icon name="Heart" size="small" color="feedback.critical.solid" decorative />
          </Flex>
        </Card.Body>
      </Card>
    </Flex>
  );
}

function SocialStrip() {
  const stats = [
    { value: '36', label: 'componentes' },
    { value: '12', label: 'papéis cromáticos' },
    { value: '5', label: 'níveis de cascade' },
    { value: 'AA', label: 'WCAG por default' },
  ];
  return (
    <Box
      borderTopWidth="hairline"
      borderBottomWidth="hairline"
      borderTopStyle="solid"
      borderBottomStyle="solid"
      borderTopColor="border.subtle"
      borderBottomColor="border.subtle"
      backgroundColor="background.default"
    >
      <Container>
        <Flex
          paddingY="medium"
          gap={{ base: 'medium', md: 'giant' }}
          justifyContent="space-around"
          flexWrap="wrap"
        >
          {stats.map((stat) => (
            <Flex
              key={stat.label}
              flexDirection="column"
              alignItems="center"
              gap="nano"
              minWidth="80px"
            >
              <Text fontSize="xlarge" fontWeight="bold" color="text.primary" lineHeight="xlarge">
                {stat.value}
              </Text>
              <Text fontSize="xs" color="text.tertiary" textTransform="uppercase" letterSpacing="wide">
                {stat.label}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Container>
    </Box>
  );
}

function FeaturesGrid() {
  return (
    <Box paddingY={{ base: 'huge', md: 'giant' }} backgroundColor="background.default">
      <Container>
        <Flex flexDirection="column" gap="large">
          <Flex flexDirection="column" gap="micro" maxWidth="560px">
            <Text fontSize="xs" fontWeight="semibold" color="brand.solid" textTransform="uppercase" letterSpacing="wide">
              Por que arbor
            </Text>
            <Text
              as="h2"
              fontSize={{ base: 'large', md: 'xlarge' }}
              fontWeight="bold"
              color="text.primary"
              letterSpacing="tightest"
              lineHeight={{ base: 'xlarge', md: 'displaySmall' }}
            >
              Um motor enxuto. Tema rico. Decisões duráveis.
            </Text>
            <Text fontSize="md" color="text.secondary" lineHeight="small">
              Defaults pensados para que você comece com algo bonito. Pontos de extensão para
              que cada produto tenha identidade própria sem editar o sistema.
            </Text>
          </Flex>

          <Box
            display="grid"
            gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
            gap="medium"
          >
            {features.map((feature) => (
              <Card key={feature.title} variant="outlined" padding="large">
                <Card.Body>
                  <Flex flexDirection="column" gap="small" alignItems="flex-start">
                    <Circle size="44px" backgroundColor="brand.bgSubtle">
                      <Icon name={feature.icon as 'Sparkles'} size="medium" color="brand.solid" decorative />
                    </Circle>
                    <Text fontSize="medium" fontWeight="semibold" color="text.primary" lineHeight="medium">
                      {feature.title}
                    </Text>
                    <Text fontSize="sm" color="text.secondary" lineHeight="small">
                      {feature.description}
                    </Text>
                  </Flex>
                </Card.Body>
              </Card>
            ))}
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}

function TestimonialsRow() {
  return (
    <Box paddingY={{ base: 'huge', md: 'giant' }} backgroundColor="background.subtle">
      <Container>
        <Flex flexDirection="column" gap="large">
          <Text
            as="h2"
            fontSize={{ base: 'large', md: 'xlarge' }}
            fontWeight="bold"
            color="text.primary"
            letterSpacing="tightest"
            lineHeight={{ base: 'xlarge', md: 'displaySmall' }}
            maxWidth="640px"
          >
            Times que constroem em cima de arbor.
          </Text>
          <Flex
            flexDirection={{ base: 'column', md: 'row' }}
            gap="medium"
          >
            {testimonials.map((t) => (
              <Card key={t.author} variant="flat" padding="large" style={{ flex: 1 }}>
                <Card.Body>
                  <Flex flexDirection="column" gap="small">
                    <Icon name="MessageCircle" size="medium" color="brand.solid" decorative />
                    <Text fontSize="md" fontWeight="medium" color="text.primary" lineHeight="small">
                      “{t.quote}”
                    </Text>
                    <Flex alignItems="center" gap="micro" marginTop="micro">
                      <Avatar size="small">
                        <Avatar.Fallback>
                          {t.author.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </Avatar.Fallback>
                      </Avatar>
                      <Flex flexDirection="column">
                        <Text fontSize="sm" fontWeight="semibold" color="text.primary">
                          {t.author}
                        </Text>
                        <Text fontSize="xs" color="text.tertiary">
                          {t.role}
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </Card.Body>
              </Card>
            ))}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}

function FinalCta() {
  return (
    <Box paddingY={{ base: 'huge', md: 'giant' }} backgroundColor="background.default">
      <Container>
        <Box
          backgroundColor="brand.bgSubtle"
          borderRadius="large"
          paddingY={{ base: 'large', md: 'giant' }}
          paddingX={{ base: 'large', md: 'giant' }}
          position="relative"
          overflow="hidden"
        >
          <Circle
            position="absolute"
            size="320px"
            top="-100px"
            right="-100px"
            backgroundColor="brand.bgElement"
            opacity={0.5}
          />
          <Flex
            flexDirection="column"
            alignItems={{ base: 'flex-start', md: 'center' }}
            gap="small"
            textAlign={{ base: 'left', md: 'center' }}
            position="relative"
            zIndex={1}
            maxWidth="720px"
            mx="auto"
          >
            <Text
              as="h2"
              fontSize={{ base: 'xlarge', md: 'displaySmall' }}
              fontWeight="bold"
              color="text.primary"
              letterSpacing="tightest"
              lineHeight={{ base: 'displaySmall', md: 'displayMedium' }}
            >
              Pronto para começar com o pé direito?
            </Text>
            <Text fontSize="md" color="text.secondary" lineHeight="small">
              Instale, importe, componha. v1 estável e governada por RFC.
              Onboarding em 10 minutos.
            </Text>
            <Flex gap="small" flexWrap="wrap" justifyContent={{ base: 'flex-start', md: 'center' }} marginTop="micro">
              <Button variant="primary" size="large">Começar agora</Button>
              <Button variant="ghost" size="large">Ler a documentação</Button>
            </Flex>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
}

function Footer() {
  return (
    <Box
      as="footer"
      borderTopWidth="hairline"
      borderTopStyle="solid"
      borderTopColor="border.subtle"
      backgroundColor="background.default"
    >
      <Container>
        <Flex
          paddingY="medium"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap="small"
        >
          <Flex alignItems="center" gap="micro">
            <Circle size="24px" backgroundColor="brand.solid">
              <Icon name="Sparkles" size="xsmall" color="text.inverse" decorative />
            </Circle>
            <Text fontSize="sm" color="text.tertiary">
              © 2026 arbor — design system multi-produto
            </Text>
          </Flex>
          <Flex gap="medium">
            <Text as="a" fontSize="sm" color="text.tertiary" cursor="pointer">GitHub</Text>
            <Text as="a" fontSize="sm" color="text.tertiary" cursor="pointer">Storybook</Text>
            <Text as="a" fontSize="sm" color="text.tertiary" cursor="pointer">Changelog</Text>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
