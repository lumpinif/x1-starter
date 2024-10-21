import {
  Body,
  Button,
  Container,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
} from "@react-email/components";
import { Logo } from "components/logo";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3001";

export default function WelcomeEmail() {
  return (
    <Html>
      <Preview>Welcome</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto font-sans">
          <Container className="mx-auto my-[40px] max-w-[600px] border-transparent">
            <Logo baseUrl={baseUrl} />
            <Heading className="mx-0 my-[30px] p-0 text-center font-normal">
              Welcome to x1-starter
            </Heading>
            <Section className="mb-4">
              Hi, I'm Pontus, one of the founders.
            </Section>
            <Section className="mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              euismod, nisi vel consectetur interdum, nisl nunc egestas nunc,
              vitae tincidunt nisl nunc euismod nunc. Sed euismod, nisi vel
              consectetur interdum, nisl nunc egestas nunc, vitae tincidunt nisl
              nunc euismod nunc. Sed euismod, nisi vel consectetur interdum,
              nisl nunc egestas nunc, vitae tincidunt nisl nunc euismod nunc.
            </Section>
            <Section className="mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Section>
            <Section className="mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Section>
            <Section className="mb-6">
              <Link href={baseUrl}>
                <Button className="bg-black p-4 text-center text-white">
                  Get started
                </Button>
              </Link>
            </Section>
            <Hr />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
