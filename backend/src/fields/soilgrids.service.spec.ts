import { Test, TestingModule } from '@nestjs/testing';
import { SoilGridsService } from './soilgrids.service';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SoilGridsService', () => {
  let service: SoilGridsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SoilGridsService],
    }).compile();

    service = module.get<SoilGridsService>(SoilGridsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchSoilGridsData', () => {
    it('should return soil data when API call succeeds', async () => {
      // Mock successful API response
      const mockApiResponse = {
        status: 200,
        data: {
          properties: {
            phh2o: {
              layers: {
                '0-30cm': {
                  mean: 65, // pH * 10 = 6.5
                },
              },
            },
            soc: {
              layers: {
                '0-30cm': {
                  mean: 25, // organic carbon * 10 = 2.5%
                },
              },
            },
            clay: {
              layers: {
                '0-30cm': {
                  mean: 150, // clay % * 10 = 15%
                },
              },
            },
            sand: {
              layers: {
                '0-30cm': {
                  mean: 300, // sand % * 10 = 30%
                },
              },
            },
          },
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockApiResponse);

      const result = await service.fetchSoilGridsData(28.6139, 77.2090);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://rest.isric.org/soilgrids/v2.0/properties/query',
        expect.objectContaining({
          params: expect.objectContaining({
            lon: 77.2090,
            lat: 28.6139,
            property: ['phh2o', 'soc', 'clay', 'sand', 'ocs'],
            depth: '0-30cm',
            value: 'mean',
          }),
        })
      );

      expect(result).toEqual({
        ph: 6.5,
        organicCarbon: 2.5,
        clayPercent: 15,
        sandPercent: 30,
      });
    });

    it('should return empty object when API data is incomplete', async () => {
      // Mock API response with missing data
      const mockApiResponse = {
        status: 200,
        data: {
          properties: {
            phh2o: {
              layers: {
                '0-30cm': {
                  mean: 60,
                },
              },
            },
            // Missing other properties
          },
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockApiResponse);

      const result = await service.fetchSoilGridsData(28.6139, 77.2090);

      expect(result).toEqual({
        ph: 6.0,
        organicCarbon: undefined,
        clayPercent: undefined,
        sandPercent: undefined,
      });
    });

    it('should return empty object when API fails', async () => {
      // Mock API error
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

      const result = await service.fetchSoilGridsData(28.6139, 77.2090);

      // Should return empty object instead of throwing
      expect(result).toEqual({});
    });

    it('should return empty object when API returns invalid status', async () => {
      // Mock API error response
      const mockApiResponse = {
        status: 500,
        data: {},
      };
      mockedAxios.get.mockResolvedValueOnce(mockApiResponse);

      const result = await service.fetchSoilGridsData(28.6139, 77.2090);

      // Should return empty object
      expect(result).toEqual({});
    });
  });
});